import { MongoClient, ObjectId } from 'mongodb';
import { randomBytes, scryptSync } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || 'kalaconnect';

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

// Helper: consistent picsum image for each product
function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/800/800`;
}

const artisans = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@kalaconnect.me',
    location: 'Madhubani, Bihar',
    story: 'A fifth-generation Madhubani artist, Priya learned this ancient art form from her grandmother. Her work has been exhibited at craft fairs across India and she is committed to preserving the traditional motifs of Mithila painting.',
    heritage: 'Madhubani painting tradition, passed down through women in her family since the 1960s',
    role: 'artisan' as const,
    password: 'Artisan@123',
    products: [
      { name: 'Madhubani Fish Motif Painting', description: 'A traditional Madhubani painting depicting fish motifs symbolizing fertility and prosperity. Hand-painted on handmade paper using natural dyes and pigments. The intricate geometric patterns and bold outlines are characteristic of the Mithila style.', price: 3500, category: 'Paintings', tags: ['Madhubani', 'Bihar', 'Fish Motif', 'Natural Dyes'], imgSeed: 'madhubani-fish' },
      { name: 'Madhubani Wedding Scene', description: 'Elaborate Madhubani painting depicting a traditional Bihar wedding ceremony. Filled with detailed figures of musicians, dancers, and wedding rituals, this piece uses natural colors derived from turmeric, indigo, and vermilion.', price: 8500, category: 'Paintings', tags: ['Madhubani', 'Wedding', 'Bihar', 'Ceremonial'], imgSeed: 'madhubani-wedding' },
      { name: 'Madhubani Tree of Life', description: 'A stunning Madhubani Tree of Life painting symbolizing the connection between earth and sky. Each branch tells a story through traditional symbols including birds, flowers, and animals.', price: 5500, category: 'Paintings', tags: ['Madhubani', 'Tree of Life', 'Bihar', 'Spiritual'], imgSeed: 'madhubani-tree' },
      { name: 'Madhubani Peacock Duo', description: 'Beautiful Madhubani painting featuring two peacocks surrounded by floral motifs. The peacock, a symbol of grace and beauty in Indian culture, is rendered in vivid natural colors against a earthy background.', price: 4200, category: 'Paintings', tags: ['Madhubani', 'Peacock', 'Bihar', 'Birds'], imgSeed: 'madhubani-peacock' },
    ],
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@kalaconnect.me',
    location: 'Thanjavur, Tamil Nadu',
    story: 'Rajesh comes from a family of Tanjore painting artisans with over 80 years of tradition. He specializes in using gold foil and semi-precious stones to create divine depictions of Hindu deities.',
    heritage: 'Tanjore painting tradition from Tamil Nadu, known for gold leaf embellishments and vibrant colors',
    role: 'artisan' as const,
    password: 'Artisan@123',
    products: [
      { name: 'Tanjore Lord Krishna', description: 'Exquisite Tanjore painting of Lord Krishna adorned with gold foil and embellished with semi-precious stones. The rich colors and three-dimensional effect achieved through gold work make this a stunning piece of devotional art.', price: 12000, category: 'Paintings', tags: ['Tanjore', 'Krishna', 'Gold Foil', 'Tamil Nadu'], imgSeed: 'tanjore-krishna' },
      { name: 'Tanjore Lakshmi Devi', description: 'Traditional Tanjore painting of Goddess Lakshmi standing on a lotus. Heavy gold foil work, intricate jewelry details, and a vibrant red background make this a classic representation of the goddess of prosperity.', price: 15000, category: 'Paintings', tags: ['Tanjore', 'Lakshmi', 'Gold Foil', 'Goddess'], imgSeed: 'tanjore-lakshmi' },
      { name: 'Tanjore Ganesha with Gold Leaf', description: 'A magnificent Tanjore painting of Lord Ganesha featuring extensive 22-carat gold foil work. The elephant-headed deity is depicted with four arms holding his symbolic objects against a deep blue backdrop.', price: 11000, category: 'Paintings', tags: ['Tanjore', 'Ganesha', 'Gold Leaf', 'Devotional'], imgSeed: 'tanjore-ganesha' },
      { name: 'Tanjore Saraswati Portrait', description: 'Goddess Saraswati playing the veena, rendered in the classic Tanjore style with gold foil accents and embedded gemstones. The intricate crown and jewelry details showcase the masterful craftsmanship.', price: 13500, category: 'Paintings', tags: ['Tanjore', 'Saraswati', 'Gold', 'Music'], imgSeed: 'tanjore-saraswati' },
    ],
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya.gupta@kalaconnect.me',
    location: 'Palghar, Maharashtra',
    story: 'Ananya belongs to the Warli tribal community and has been painting since the age of seven. She works with her village cooperative to bring authentic Warli art to a global audience.',
    heritage: 'Warli tribal art from Maharashtra, using white pigment on mud walls',
    role: 'artisan' as const,
    password: 'Artisan@123',
    products: [
      { name: 'Warli Harvest Festival', description: 'A vibrant Warli painting depicting a harvest festival scene with village figures dancing in a circle. Created using the traditional white pigment on a mud-brown background, this artwork captures the joy of rural Maharashtra.', price: 2800, category: 'Paintings', tags: ['Warli', 'Maharashtra', 'Tribal', 'Harvest'], imgSeed: 'warli-harvest' },
      { name: 'Warli Daily Life Panorama', description: 'Large Warli painting illustrating daily village life — cooking, farming, fishing, and celebrations. The simple yet expressive stick figures create a rhythmic composition that tells stories of tribal traditions.', price: 6500, category: 'Paintings', tags: ['Warli', 'Daily Life', 'Tribal', 'Panorama'], imgSeed: 'warli-daily' },
      { name: 'Warli Tarpa Dance', description: 'The Tarpa dance is a central tradition in Warli culture. This painting captures the energy of dancers moving in a spiral formation around the Tarpa musician, their linked hands creating a flowing pattern.', price: 3200, category: 'Paintings', tags: ['Warli', 'Tarpa Dance', 'Tribal', 'Maharashtra'], imgSeed: 'warli-dance' },
      { name: 'Warli Palmyra Tree Scene', description: 'A serene Warli painting featuring palmyra trees and village huts under a starry sky. The geometric patterns of the trees contrast beautifully with the flowing figures engaged in evening activities.', price: 2400, category: 'Paintings', tags: ['Warli', 'Nature', 'Village', 'Trees'], imgSeed: 'warli-palmyra' },
    ],
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@kalaconnect.me',
    location: 'Jaipur, Rajasthan',
    story: 'Vikram is a master potter from Jaipur specializing in traditional Blue Pottery. Despite the name, this craft involves no clay — it is made from quartz and fullers earth, a technique unique to Rajasthan.',
    heritage: 'Jaipur Blue Pottery tradition, a skill passed down through generations of Rajasthani artisans',
    role: 'artisan' as const,
    password: 'Artisan@123',
    products: [
      { name: 'Blue Pottery Decorative Vase', description: 'Handcrafted Blue Pottery vase from Jaipur featuring intricate floral patterns in cobalt blue on a white background. Made using the traditional quartz-based dough and fired at low temperatures for a unique finish.', price: 1800, category: 'Pottery', tags: ['Blue Pottery', 'Jaipur', 'Rajasthan', 'Vase'], imgSeed: 'blue-pottery-vase' },
      { name: 'Blue Pottery Dinner Set (6 pcs)', description: 'Elegant 6-piece dinner set in Jaipur Blue Pottery with hand-painted floral and geometric motifs. Each piece is carefully crafted using the traditional technique of mixing quartz and fullers earth.', price: 4500, category: 'Pottery', tags: ['Blue Pottery', 'Dinner Set', 'Jaipur', 'Hand-painted'], imgSeed: 'blue-pottery-dinner' },
      { name: 'Blue Pottery Planter with Stand', description: 'Beautiful Blue Pottery planter on a carved wooden stand. The cobalt blue floral patterns contrast with the white glaze, making it a striking addition to any home decor.', price: 2200, category: 'Pottery', tags: ['Blue Pottery', 'Planter', 'Rajasthan', 'Home Decor'], imgSeed: 'blue-pottery-planter' },
      { name: 'Blue Pottery Coaster Set (8 pcs)', description: 'Set of 8 hand-painted Blue Pottery coasters featuring traditional Rajasthani patterns. Each coaster is unique, showcasing different floral and geometric designs in the signature blue-on-white palette.', price: 995, category: 'Pottery', tags: ['Blue Pottery', 'Coasters', 'Jaipur', 'Gift'], imgSeed: 'blue-pottery-coasters' },
    ],
  },
  {
    name: 'Lakshmi Devi',
    email: 'lakshmi.devi@kalaconnect.me',
    location: 'Peddana, Andhra Pradesh',
    story: 'Lakshmi is a skilled Kalamkari artist who learned the craft from her mother. She is known for her meticulous hand-drawn designs using natural dyes extracted from plants and minerals.',
    heritage: 'Kalamkari art form from Andhra Pradesh, using natural dyes and hand-drawn block printing',
    role: 'artisan' as const,
    password: 'Artisan@123',
    products: [
      { name: 'Kalamkari Surya Motif Wall Hanging', description: 'A striking Kalamkari wall hanging featuring the Sun god Surya surrounded by mythological figures. Hand-drawn using a bamboo pen with natural black and red dyes on hand-woven cotton fabric.', price: 3800, category: 'Textiles', tags: ['Kalamkari', 'Andhra', 'Wall Hanging', 'Natural Dyes'], imgSeed: 'kalamkari-surya' },
      { name: 'Kalamkari Floral Bedspread', description: 'Double bedspread hand-printed with intricate floral Kalamkari patterns. The natural vegetable dyes in earthy tones create a timeless appeal. Each piece takes over two weeks to complete.', price: 5500, category: 'Textiles', tags: ['Kalamkari', 'Bedspread', 'Floral', 'Natural Dyes'], imgSeed: 'kalamkari-bedspread' },
      { name: 'Kalamkari Cotton Saree', description: 'Hand-drawn Kalamkari saree in fine cotton with temple border designs. The saree features scenes from the Ramayana along the border and traditional floral patterns in the body.', price: 7200, category: 'Textiles', tags: ['Kalamkari', 'Saree', 'Cotton', 'Hand-drawn'], imgSeed: 'kalamkari-saree' },
      { name: 'Kalamkari Yoga Mat Bag', description: 'A unique Kalamkari-printed yoga mat bag, combining traditional art with modern utility. The bag features hand-block-printed tree of life motifs in natural indigo and madder root dyes.', price: 1499, category: 'Textiles', tags: ['Kalamkari', 'Yoga Bag', 'Block Print', 'Eco-friendly'], imgSeed: 'kalamkari-yoga' },
    ],
  },
  {
    name: 'Arjun Nair',
    email: 'arjun.nair@kalaconnect.me',
    location: 'Thrissur, Kerala',
    story: 'Arjun is a master woodcarver from Kerala specializing in traditional temple-style sculptures. He has been carving since childhood and his workshop produces both traditional deities and contemporary art pieces.',
    heritage: 'Kerala wood carving tradition, using rosewood and teak for temple and home sculptures',
    role: 'artisan' as const,
    password: 'Artisan@123',
    products: [
      { name: 'Rosewood Dancing Nataraja', description: 'Intricately carved rosewood sculpture of Nataraja, the cosmic dancer. Every detail of Lord Shiva\'s dancing pose is rendered with precision, from the flowing hair to the damaru drum. Perfect for home altars or decor.', price: 9500, category: 'Sculptures', tags: ['Wood Carving', 'Nataraja', 'Rosewood', 'Kerala'], imgSeed: 'wood-nataraja' },
      { name: 'Teak Wood Elephant Trio', description: 'Hand-carved teak wood sculpture of three elephants in a procession — a symbol of royalty and prosperity in Kerala. Each elephant is carved from a single block of teak with mahout figures on top.', price: 7800, category: 'Sculptures', tags: ['Wood Carving', 'Elephant', 'Teak', 'Kerala'], imgSeed: 'wood-elephants' },
      { name: 'Rosewood Kathakali Face Mask', description: 'A beautifully carved rosewood Kathakali face mask representing the character of a noble hero. The elaborate headgear and facial expressions capture the essence of this classical dance-drama of Kerala.', price: 3200, category: 'Sculptures', tags: ['Wood Carving', 'Kathakali', 'Rosewood', 'Kerala'], imgSeed: 'wood-kathakali' },
      { name: 'Sandalwood Miniature Ganesha', description: 'A miniature sandalwood carving of Lord Ganesha, perfect for travel altars or gifting. The sweet fragrance of sandalwood adds a sensory dimension to this finely carved piece.', price: 2500, category: 'Sculptures', tags: ['Sandalwood', 'Ganesha', 'Miniature', 'Carving'], imgSeed: 'sandalwood-ganesha' },
    ],
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@kalaconnect.me',
    location: 'Bhuj, Gujarat',
    story: 'Meera is a master weaver and embroidery artist from the Kutch region. She leads a women\'s self-help group that produces authentic Rabari and Kutchi embroidery, providing livelihoods to over 30 women in her village.',
    heritage: 'Kutchi embroidery and weaving from Gujarat, featuring mirror work and vibrant geometric patterns',
    role: 'artisan' as const,
    password: 'Artisan@123',
    products: [
      { name: 'Kutchi Embroidered Throw', description: 'A vibrant throw blanket featuring traditional Kutchi embroidery with mirror work and geometric patterns. Hand-embroidered by skilled artisans from the Rabari community, each piece takes weeks to complete.', price: 4800, category: 'Textiles', tags: ['Kutchi', 'Embroidery', 'Gujarat', 'Mirror Work'], imgSeed: 'kutchi-throw' },
      { name: 'Bandhani Silk Dupatta', description: 'A delicate Bandhani (tie-dye) dupatta in pure silk with traditional dots and paisley patterns. The intricate resist-dyeing technique creates thousands of tiny tie-dots that form beautiful symmetrical designs.', price: 3500, category: 'Textiles', tags: ['Bandhani', 'Silk', 'Dupatta', 'Gujarat'], imgSeed: 'bandhani-dupatta' },
      { name: 'Mojari Handcrafted Footwear', description: 'Traditional Rajasthani-Gujarati mojari footwear handcrafted with leather uppers and embroidered decorations. These comfortable slip-on shoes feature pointed toes and intricate thread work.', price: 1800, category: 'Other', tags: ['Mojari', 'Footwear', 'Handcrafted', 'Leather'], imgSeed: 'mojari-shoes' },
      { name: 'Kutchi Wall Hanging with Mirrors', description: 'A stunning wall hanging featuring traditional Kutchi embroidery with embedded mirrors. The geometric patterns and vibrant colors bring the spirit of Gujarat into any space. Made from handwoven cotton.', price: 2900, category: 'Textiles', tags: ['Kutchi', 'Wall Hanging', 'Mirror Work', 'Geometric'], imgSeed: 'kutchi-wallhanging' },
    ],
  },
  {
    name: 'Devendra Patel',
    email: 'devendra.patel@kalaconnect.me',
    location: 'Srinagar, Jammu & Kashmir',
    story: 'Devendra is a seventh-generation pashmina weaver from the Kashmir valley. His family has been producing some of the finest pashmina shawls for over 150 years, using traditional handlooms in their village workshop.',
    heritage: 'Kashmiri pashmina weaving tradition, known for fine cashmere shawls and intricate sozni embroidery',
    role: 'artisan' as const,
    password: 'Artisan@123',
    products: [
      { name: 'Pure Pashmina Shawl - Wine Red', description: 'Luxurious handwoven pashmina shawl in deep wine red, crafted from the finest cashmere wool sourced from Changthangi goats. The shawl features traditional Kashmiri sozni embroidery on the borders with delicate floral motifs.', price: 15000, category: 'Textiles', tags: ['Pashmina', 'Kashmir', 'Cashmere', 'Shawl'], imgSeed: 'pashmina-red' },
      { name: 'Kani Silk Scarf', description: 'Handwoven Kani silk scarf with traditional paisley patterns. The Kani weaving technique, unique to Kashmir, involves using small wooden sticks to create intricate patterns in the fabric.', price: 3500, category: 'Textiles', tags: ['Kani', 'Silk', 'Scarf', 'Kashmir'], imgSeed: 'kani-scarf' },
      { name: 'Sozni Embroidered Stole', description: 'An elegant stole with intricate Sozni embroidery using fine silk threads on a soft pashmina base. The needlework features traditional Chinar leaf patterns and blooming almond blossoms.', price: 8500, category: 'Textiles', tags: ['Sozni', 'Embroidery', 'Stole', 'Kashmir'], imgSeed: 'sozni-stole' },
      { name: 'Embroidered Pashmina Wrap', description: 'A versatile pashmina wrap in cream with subtle all-over Sozni embroidery. Lightweight yet warm, this piece can be worn as a shawl or scarf and features a hand-knotted fringe.', price: 11000, category: 'Textiles', tags: ['Pashmina', 'Wrap', 'Kashmir', 'Embroidery'], imgSeed: 'pashmina-wrap' },
    ],
  },
];

const buyers = [
  { name: 'Amit Verma', email: 'amit.verma@example.com', role: 'buyer' as const, password: 'Buyer@123' },
  { name: 'Sneha Patel', email: 'sneha.patel@example.com', role: 'buyer' as const, password: 'Buyer@123' },
  { name: 'Rahul Deshmukh', email: 'rahul.deshmukh@example.com', role: 'buyer' as const, password: 'Buyer@123' },
];

interface Artisan {
  _id: string;
  name: string;
  email: string;
  location: string;
  story: string;
  heritage: string;
}

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const productsCol = db.collection('products');
  const usersCol = db.collection('users');
  const ordersCol = db.collection('orders');
  const logsCol = db.collection('systemLogs');
  const contactCol = db.collection('contactMessages');

  console.log('Connected to MongoDB...');

  // Clear existing data
  console.log('Clearing existing data...');
  await productsCol.deleteMany({});
  await usersCol.deleteMany({ role: { $ne: 'admin' } });
  await ordersCol.deleteMany({});
  await contactCol.deleteMany({});
  await logsCol.deleteMany({});

  // Create artisans
  console.log('Creating artisan profiles...');
  const artisanRecords: Artisan[] = [];
  for (const a of artisans) {
    const hash = hashPassword(a.password);
    const res = await usersCol.insertOne({
      email: a.email,
      password: hash,
      name: a.name,
      role: 'artisan',
      emailVerified: true,
      location: a.location,
      story: a.story,
      heritage: a.heritage,
      avatar: img(`avatar-${a.name.toLowerCase().replace(/\s+/g, '-')}`),
      createdAt: new Date(Date.now() - Math.random() * 90 * 86400000),
    });
    const id = res.insertedId.toString();
    artisanRecords.push({ _id: id, name: a.name, email: a.email, location: a.location, story: a.story, heritage: a.heritage });
    console.log(`  Created artisan: ${a.name}`);
  }

  // Create buyers
  console.log('Creating buyer profiles...');
  for (const b of buyers) {
    const hash = hashPassword(b.password);
    await usersCol.insertOne({
      email: b.email,
      password: hash,
      name: b.name,
      role: 'buyer',
      emailVerified: true,
      createdAt: new Date(Date.now() - Math.random() * 60 * 86400000),
    });
    console.log(`  Created buyer: ${b.name}`);
  }

  // Create products
  console.log('Creating products...');
  const allProductIds: string[] = [];
  for (const a of artisans) {
    const artisanRec = artisanRecords.find(ar => ar.name === a.name)!;
    for (const p of a.products) {
      const createdDate = new Date(Date.now() - Math.random() * 120 * 86400000);
      const res = await productsCol.insertOne({
        name: p.name,
        description: p.description,
        price: p.price,
        stock: Math.floor(Math.random() * 15) + 3,
        status: 'Active',
        artisanId: artisanRec._id,
        artisanName: a.name,
        image: img(p.imgSeed),
        images: [img(`${p.imgSeed}-1`), img(`${p.imgSeed}-2`)],
        category: p.category,
        tags: p.tags,
        createdAt: createdDate,
        updatedAt: createdDate,
      });
      allProductIds.push(res.insertedId.toString());
      console.log(`  Created product: ${p.name} (₹${p.price})`);
    }
  }

  // Create some orders to show activity
  console.log('Creating orders...');
  const statuses = ['Delivered', 'Delivered', 'Delivered', 'Shipped', 'Confirmed', 'Processing'] as const;
  const artisanIds = artisanRecords.map(a => a._id);
  const buyerEmails = buyers.map(b => b.email);

  for (let i = 0; i < 12; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const createdDate = new Date(Date.now() - daysAgo * 86400000);
    const productIndex = Math.floor(Math.random() * allProductIds.length);
    const productRes = await productsCol.findOne({ _id: new ObjectId(allProductIds[productIndex]) });
    if (!productRes) continue;

    const orderStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const buyerEmail = buyerEmails[Math.floor(Math.random() * buyerEmails.length)];
    const buyerUser = await usersCol.findOne({ email: buyerEmail });
    if (!buyerUser) continue;

    const qty = Math.floor(Math.random() * 3) + 1;
    const subtotal = productRes.price * qty;
    const fee = Math.round(subtotal * 0.05);
    const total = subtotal + fee;

    const orderId = `KALA${String(Date.now()).slice(-6)}${String(i).padStart(3, '0')}`;
    const statusHistory = [];
    const orderCreated = new Date(createdDate);
    statusHistory.push({ status: 'Processing', timestamp: new Date(orderCreated.getTime() + 60000), updatedBy: 'system', updatedByRole: 'system', note: 'Order placed' });

    if (['Confirmed', 'Shipped', 'Delivered'].includes(orderStatus)) {
      statusHistory.push({ status: 'Confirmed', timestamp: new Date(orderCreated.getTime() + 86400000), updatedBy: productRes.artisanId, updatedByRole: 'artisan', note: 'Order confirmed by artisan' });
    }
    if (['Shipped', 'Delivered'].includes(orderStatus)) {
      statusHistory.push({ status: 'Shipped', timestamp: new Date(orderCreated.getTime() + 3 * 86400000), updatedBy: productRes.artisanId, updatedByRole: 'artisan', note: 'Shipped via India Post - tracking ID: IND' + Math.random().toString(36).substring(2, 10).toUpperCase() });
    }
    if (orderStatus === 'Delivered') {
      statusHistory.push({ status: 'Delivered', timestamp: new Date(orderCreated.getTime() + 10 * 86400000), updatedBy: buyerUser._id.toString(), updatedByRole: 'buyer', note: 'Order delivered successfully' });
    }

    await ordersCol.insertOne({
      orderId,
      buyerId: buyerUser._id.toString(),
      buyerName: buyerUser.name,
      buyerEmail,
      items: [{
        productId: productRes._id.toString(),
        productName: productRes.name,
        artisanId: productRes.artisanId,
        artisanName: productRes.artisanName,
        image: productRes.image,
        price: productRes.price,
        quantity: qty,
      }],
      shipping: {
        name: buyerUser.name,
        address: `${Math.floor(Math.random() * 999) + 1}, ${['MG Road', 'Park Street', 'Lake View Road', 'Gandhi Nagar', 'Sector 12'][Math.floor(Math.random() * 5)]}`,
        city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'][Math.floor(Math.random() * 7)],
        pincode: String(Math.floor(Math.random() * 900000) + 100000),
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      },
      paymentMethod: 'Cash on Delivery',
      subtotal,
      transactionFee: fee,
      total,
      status: orderStatus,
      statusHistory,
      createdAt: createdDate,
      updatedAt: statusHistory[statusHistory.length - 1]?.timestamp || createdDate,
    });
    console.log(`  Created order ${orderId}: ${productRes.name} x${qty} - ₹${total} (${orderStatus})`);
  }

  // Add some contact messages
  console.log('Creating contact messages...');
  const contactMessages = [
    { name: 'Neha Kapoor', email: 'neha.k@example.com', subject: 'Inquiry about Madhubani paintings', message: 'I am interested in purchasing Madhubani paintings for my home. Do you offer customization options for sizes and colors?', read: true },
    { name: 'Rohan Mehta', email: 'rohan.mehta@example.com', subject: 'Artisan registration', message: 'I am a Pattachitra artist from Odisha and would like to register as an artisan on your platform. Please share the registration process details.', read: false },
    { name: 'Priyanka Singh', email: 'priyanka.s@example.com', subject: 'Order issue', message: 'I placed an order last week but it still shows as Processing. Could you please check the status and update me on the delivery timeline?', read: false },
  ];
  for (const msg of contactMessages) {
    await contactCol.insertOne({
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      read: msg.read,
      createdAt: new Date(Date.now() - Math.random() * 30 * 86400000),
    });
  }

  // Add system logs for realism
  console.log('Creating system logs...');
  const logEntries = [
    { level: 'success', category: 'auth', message: 'New user registered', details: 'Email: user@example.com, Role: buyer' },
    { level: 'info', category: 'order', message: 'Order placed successfully', details: 'Order ID: KALA001, Amount: ₹3,500' },
    { level: 'success', category: 'product', message: 'New product added', details: 'Product: Madhubani Fish Motif Painting, Artisan: Priya Sharma' },
    { level: 'info', category: 'api', message: 'API request processed', details: 'Path: /api/db/products, Method: GET, Status: 200', duration: 245 },
    { level: 'success', category: 'order', message: 'Order delivered', details: 'Order ID: KALA002, Delivery confirmed by buyer' },
    { level: 'info', category: 'auth', message: 'User login successful', details: 'Email: amit.verma@example.com, IP: 192.168.1.1' },
    { level: 'warn', category: 'auth', message: 'Failed login attempt', details: 'Email: unknown@example.com, IP: 10.0.0.1' },
    { level: 'info', category: 'user', message: 'Profile updated', details: 'User: Priya Sharma, Fields: location, story' },
    { level: 'success', category: 'order', message: 'Payment confirmed', details: 'Order ID: KALA003, Amount: ₹5,500, Method: COD' },
    { level: 'info', category: 'api', message: 'Analytics data retrieved', details: 'Path: /api/db/stats, Duration: 180ms' },
  ];
  for (const log of logEntries) {
    await logsCol.insertOne({
      ...log,
      createdAt: new Date(Date.now() - Math.random() * 15 * 86400000),
      duration: log.duration,
    });
  }

  console.log('\n--- Seed complete ---');
  console.log(`Artisans: ${artisanRecords.length}`);
  console.log(`Buyers: ${buyers.length}`);
  console.log(`Products: ${allProductIds.length}`);
  console.log(`Orders: 12`);
  console.log(`Contact messages: ${contactMessages.length}`);
  console.log('\nLogin credentials:');
  console.log('Artisans: artisan-email / Artisan@123');
  console.log('Buyers: buyer-email / Buyer@123');
  console.log('(Note: users are created with emailVerified=true)');

  await client.close();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
