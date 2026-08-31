const http = require('http');

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const reqHeaders = { ...headers };
    if (data) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let raw = '';
      res.on('data', (chunk) => raw += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          resolve({ status: res.statusCode, data: json, raw });
        } catch {
          resolve({ status: res.statusCode, data: null, raw });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('  RVK MOBILES — COMPREHENSIVE SYSTEM VERIFICATION  ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health & SPA Root
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.data?.status === 'ok', 'API Health check returns 200 OK');

    const spaRoot = await request('GET', '/');
    assert(spaRoot.status === 200 && spaRoot.raw.includes('RVK MOBILES'), 'Frontend SPA HTML served on root /');

    // 2. Verified Products Catalog
    const prods = await request('GET', '/api/products');
    assert(prods.status === 200 && prods.data?.products?.length >= 5, `Fetched ${prods.data?.products?.length} products`);
    
    const earphone = prods.data?.products?.find(p => p.slug === 'earphone-wired-with-mic');
    const airpods = prods.data?.products?.find(p => p.name.includes('AirPods'));
    const neckband = prods.data?.products?.find(p => p.name.includes('Neckband'));
    const tempered = prods.data?.products?.find(p => p.name.includes('Tempered'));

    assert(earphone && earphone.price === 89, `Verified Product: Earphone price is ₹89 (found ₹${earphone?.price})`);
    assert(airpods && airpods.price === 699, `Verified Product: AirPods price is ₹699 (found ₹${airpods?.price})`);
    assert(neckband && neckband.price === 599, `Verified Product: Neckband price is ₹599 (found ₹${neckband?.price})`);
    assert(tempered && tempered.price === 89, `Verified Product: Tempered Glass price is ₹89 (found ₹${tempered?.price})`);

    // 3. Customer Authentication
    const custEmail = `tester_${Date.now()}@rvk.com`;
    const custReg = await request('POST', '/api/auth/register', {
      name: 'Trichy Customer',
      email: custEmail,
      phone: '9840123456',
      password: 'Password@123',
      address: 'Near Teppakulam Bazaar, Trichy'
    });
    assert(custReg.status === 201 && custReg.data?.token, 'Customer Registration creates account and returns JWT token');
    const customerToken = custReg.data?.token;

    const custLogin = await request('POST', '/api/auth/login', {
      email: custEmail,
      password: 'Password@123'
    });
    assert(custLogin.status === 200 && custLogin.data?.user?.name === 'Trichy Customer', 'Customer Login authenticates successfully');

    // 4. Customer Place Order -> DB & In-app Notification
    const newOrder = await request('POST', '/api/orders', {
      items: [
        { id: earphone.id, quantity: 2 },
        { id: airpods.id, quantity: 1 }
      ],
      customer_name: 'Trichy Customer',
      customer_email: custEmail,
      customer_phone: '9840123456',
      delivery_address: '15 Main Bazaar Road, Teppakulam, Trichy',
      payment_method: 'Cash on Delivery'
    }, { Authorization: `Bearer ${customerToken}` });

    assert(newOrder.status === 201 && newOrder.data?.orderNumber, `Customer Order placed: ${newOrder.data?.orderNumber}, Total: ₹${newOrder.data?.order?.total_amount}`);
    const orderId = newOrder.data?.order?.id;
    const orderNumber = newOrder.data?.orderNumber;

    // 5. Admin Authentication
    const adminAuth = await request('POST', '/api/auth/admin-login', {
      email: 'admin@rvkmobiles.com',
      password: 'Admin@RVK2026'
    });
    assert(adminAuth.status === 200 && adminAuth.data?.token, 'Admin Portal Login authorized with JWT');
    const adminToken = adminAuth.data?.token;

    // 6. Admin Verify Order & Update Status
    const adminOrders = await request('GET', '/api/orders/admin/all', null, { Authorization: `Bearer ${adminToken}` });
    const foundOrder = adminOrders.data?.orders?.find(o => o.order_number === orderNumber);
    assert(foundOrder && foundOrder.customer_name === 'Trichy Customer', `Admin Order list contains new customer order: ${orderNumber}`);

    const statusUpdate = await request('PUT', `/api/orders/admin/${orderId}/status`, {
      order_status: 'Completed',
      payment_status: 'Paid'
    }, { Authorization: `Bearer ${adminToken}` });
    assert(statusUpdate.status === 200 && statusUpdate.data?.order?.order_status === 'Completed', 'Admin successfully updated order status to Completed');

    // 7. Admin Create Today's Offer -> Auto In-App Customer Notification
    const newOffer = await request('POST', '/api/offers/admin', {
      title: 'Festive Display Special + Free Screen Guard',
      description: 'Exclusive on-site screen replacement combo for Trichy residents today.',
      badge: "TODAY'S SPECIAL",
      original_price: 1499,
      offer_price: 1099,
      discount_text: 'Save ₹400 Today',
      target_service: 'Display Replacement',
      is_todays_offer: 1
    }, { Authorization: `Bearer ${adminToken}` });
    assert(newOffer.status === 201 && newOffer.data?.offer?.is_todays_offer === 1, "Admin created Today's Offer successfully");

    // Verify Homepage dynamically fetches Today's Offer
    const todayOfferCheck = await request('GET', '/api/offers/today');
    assert(todayOfferCheck.status === 200 && todayOfferCheck.data?.offer?.title.includes('Festive Display Special'), "Homepage API dynamically returns new Today's Offer");

    // Verify Customer receives in-app notification
    const custNotifs = await request('GET', '/api/notifications', null, { Authorization: `Bearer ${customerToken}` });
    const offerNotif = custNotifs.data?.notifications?.find(n => n.title.includes("Today's") || n.message.includes('Festive Display'));
    assert(offerNotif !== undefined, 'Customer in-app notification list received broadcast of the new offer');

    // 8. Display Service Booking & Tracking
    const displayBooking = await request('POST', '/api/services/display-booking', {
      customer_name: 'Trichy Customer',
      customer_phone: '9840123456',
      device_brand: 'Realme',
      device_model: 'Realme 9 Pro+',
      display_type: 'LED / OLED Display Replacement',
      service_type: 'Doorstep',
      address: '15 Main Bazaar Road, Teppakulam, Trichy'
    }, { Authorization: `Bearer ${customerToken}` });
    assert(displayBooking.status === 201 && displayBooking.data?.bookingCode, `Display Service booking registered: ${displayBooking.data?.bookingCode}`);
    const displayCode = displayBooking.data?.bookingCode;

    const trackDisplay = await request('GET', `/api/services/track?code=${displayCode}`);
    assert(trackDisplay.status === 200 && trackDisplay.data?.bookings?.length > 0, `Tracking service successfully retrieved booking: ${displayCode}`);

    // 9. Doorstep Service Booking & 20 KM Travel Calculation
    const doorstepUnder20 = await request('POST', '/api/services/doorstep-booking', {
      customer_name: 'Regular User',
      customer_phone: '9840123456',
      address: 'KK Nagar, Trichy',
      distance_km: 8,
      is_rvk_member: 0,
      problem_description: 'Speaker and charging port clean'
    });
    assert(doorstepUnder20.status === 201 && doorstepUnder20.data?.travelCharge === 0, 'Doorstep booking within 20 KM radius has ₹0 travel charge');

    const doorstepBeyond20 = await request('POST', '/api/services/doorstep-booking', {
      customer_name: 'Out of Radius User',
      customer_phone: '9840123456',
      address: 'Manapparai, Trichy District',
      distance_km: 35,
      is_rvk_member: 0,
      problem_description: 'Screen replacement'
    });
    assert(doorstepBeyond20.status === 201 && doorstepBeyond20.data?.travelCharge === 150, `Doorstep booking at 35 KM (15 extra km) calculates travel charge: ₹${doorstepBeyond20.data?.travelCharge}`);

    const doorstepMember = await request('POST', '/api/services/doorstep-booking', {
      customer_name: 'VIP Member',
      customer_phone: '9840123456',
      address: 'Manapparai, Trichy District',
      distance_km: 35,
      is_rvk_member: 1,
      problem_description: 'Screen replacement'
    });
    assert(doorstepMember.status === 201 && doorstepMember.data?.travelCharge === 0, 'RVK Member has ₹0 travel charge at ANY distance (35 KM)');

    // 10. Dashboard KPI metrics
    const dash = await request('GET', '/api/admin/dashboard', null, { Authorization: `Bearer ${adminToken}` });
    assert(dash.status === 200 && dash.data?.stats?.totalOrders > 0, `Admin Dashboard stats verified: ${dash.data?.stats?.totalOrders} total orders, ₹${dash.data?.stats?.totalRevenue} revenue`);

    console.log('\n====================================================');
    console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED  `);
    console.log('====================================================\n');

    if (failed > 0) process.exit(1);
    else process.exit(0);

  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();