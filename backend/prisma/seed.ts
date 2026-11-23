// import { PrismaClient, PropertyType, ListingType } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// const prisma = new PrismaClient();

// async function main() {
//   const passwordHash = await bcrypt.hash('Demo@12345', 12);
//   const demoUser = await prisma.user.upsert({
//     where: { email: 'demo@realestate.test' },
//     update: {},
//     create: { name: 'Demo Property Owner', email: 'demo@realestate.test', passwordHash, phone: '+91 98765 43210' },
//   });
//   const listings = [
//     { title: 'Sunlit 2 BHK apartment in Velachery', description: 'A well-maintained apartment close to schools, shopping and public transport. Spacious living room, airy bedrooms and covered parking.', city: 'Chennai', locality: 'Velachery', address: 'Vijaya Nagar, Velachery, Chennai', price: 8500000, bedrooms: 2, bathrooms: 2, areaSqft: 1150, propertyType: PropertyType.APARTMENT, listingType: ListingType.SALE, images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'], amenities: ['Covered parking', 'Lift', 'Power backup'] },
//     { title: 'Modern 3 BHK home near OMR', description: 'Family-friendly home with a bright kitchen, large balcony and easy access to IT parks on OMR.', city: 'Chennai', locality: 'Perungudi', address: 'Perungudi, Chennai', price: 11200000, bedrooms: 3, bathrooms: 3, areaSqft: 1480, propertyType: PropertyType.APARTMENT, listingType: ListingType.SALE, images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200'], amenities: ['Gym', 'Swimming pool', 'Security'] },
//     { title: 'Independent house with private garden', description: 'Quiet independent home with a private garden, spacious rooms and excellent road connectivity.', city: 'Chennai', locality: 'Medavakkam', address: 'Medavakkam Main Road, Chennai', price: 14500000, bedrooms: 3, bathrooms: 3, areaSqft: 1850, propertyType: PropertyType.INDEPENDENT_HOUSE, listingType: ListingType.SALE, images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200'], amenities: ['Garden', 'Car parking', 'Terrace'] },
//     { title: 'Ready to move 1 BHK for rent', description: 'Compact and comfortable apartment suitable for working professionals. Available immediately.', city: 'Chennai', locality: 'Thoraipakkam', address: 'Thoraipakkam, Chennai', price: 18000, bedrooms: 1, bathrooms: 1, areaSqft: 650, propertyType: PropertyType.APARTMENT, listingType: ListingType.RENT, images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200'], amenities: ['Lift', 'Water supply'] },
//   ];
//   for (const listing of listings) {
//     const found = await prisma.property.findFirst({ where: { title: listing.title, ownerId: demoUser.id } });
//     if (!found) await prisma.property.create({ data: { ...listing, ownerId: demoUser.id } });
//   }
//   console.log('Seed complete. Demo login: demo@realestate.test / Demo@12345');
// }
// main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());


import dotenv from 'dotenv'
dotenv.config()
import {
  PrismaClient,
  Prisma,
  PropertyType,
  ListingType,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create or reuse demo user
  const passwordHash = await bcrypt.hash('Demo@12345', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@realestate.test' },
    update: {},
    create: {
      name: 'Demo Property Owner',
      email: 'demo@realestate.test',
      passwordHash,
      phone: '+91 98765 43210',
    },
  });

  // Preserve and create the original sample listings
  const listings = [
    {
      isArchive:false,
      title: 'Sunlit 2 BHK apartment in Velachery',
      description: 'A well-maintained apartment close to schools, shopping and public transport. Spacious living room, airy bedrooms and covered parking.',
      city: 'Chennai',
      locality: 'Velachery',
      address: 'Vijaya Nagar, Velachery, Chennai',
      price: 8500000,
      bedrooms: 2,
      bathrooms: 2,
      areaSqft: 1150,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'],
      amenities: ['Covered parking', 'Lift', 'Power backup'],
    },
    {
      isArchive:false,
      title: 'Modern 3 BHK home near OMR',
      description: 'Family-friendly home with a bright kitchen, large balcony and easy access to IT parks on OMR.',
      city: 'Chennai',
      locality: 'Perungudi',
      address: 'Perungudi, Chennai',
      price: 11200000,
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 1480,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
      images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200'],
      amenities: ['Gym', 'Swimming pool', 'Security'],
    },
    {
      isArchive:false,
      title: 'Independent house with private garden',
      description: 'Quiet independent home with a private garden, spacious rooms and excellent road connectivity.',
      city: 'Chennai',
      locality: 'Medavakkam',
      address: 'Medavakkam Main Road, Chennai',
      price: 14500000,
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 1850,
      propertyType: PropertyType.INDEPENDENT_HOUSE,
      listingType: ListingType.SALE,
      images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200'],
      amenities: ['Garden', 'Car parking', 'Terrace'],
    },
    {
      isArchive:false,
      title: 'Ready to move 1 BHK for rent',
      description: 'Compact and comfortable apartment suitable for working professionals. Available immediately.',
      city: 'Chennai',
      locality: 'Thoraipakkam',
      address: 'Thoraipakkam, Chennai',
      price: 18000,
      bedrooms: 1,
      bathrooms: 1,
      areaSqft: 650,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
      images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200'],
      amenities: ['Lift', 'Water supply'],
    },
  ];

  for (const listing of listings) {
    const found = await prisma.property.findFirst({
      where: {
        isArchive:false,
        title: listing.title,
        ownerId: demoUser.id,
      },
    });

    if (!found) {
      await prisma.property.create({
        data: {
          ...listing,
          ownerId: demoUser.id,
        },
      });
    }
  }

  // Check how many properties already exist
  const existingCount = await prisma.property.count();
  const targetCount = 50000;
  const missingCount = Math.max(0, targetCount - existingCount);

  console.log(`Existing properties: ${existingCount}`);
  console.log(`Properties to generate: ${missingCount}`);

  if (missingCount > 0) {
    const cities = [
      { city: 'Chennai', localities: ['Velachery', 'Perungudi', 'Adyar', 'Medavakkam', 'Tambaram'] },
      { city: 'Bengaluru', localities: ['Whitefield', 'Electronic City', 'Indiranagar', 'Marathahalli'] },
      { city: 'Coimbatore', localities: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saravanampatti'] },
      { city: 'Hyderabad', localities: ['Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally'] },
    ];

    const propertyTypes = [
      PropertyType.APARTMENT,
      PropertyType.INDEPENDENT_HOUSE,
      PropertyType.VILLA,
      PropertyType.PLOT,
      PropertyType.COMMERCIAL,
    ];

    const batchSize = 1000;

    for (let start = 0; start < missingCount; start += batchSize) {
      const batchCount = Math.min(batchSize, missingCount - start);

      const data: Prisma.PropertyCreateManyInput[] = Array.from(
        { length: batchCount },
        (_, index) => {
          const number = existingCount + start + index + 1;
          const location = cities[number % cities.length];
          const locality =
            location.localities[number % location.localities.length];

          const bedrooms = (number % 4) + 1;
          const listingType =
            number % 3 === 0 ? ListingType.RENT : ListingType.SALE;

          return {
            ownerId: demoUser.id,
            isArchive:false,
            title: `${bedrooms} BHK Property in ${locality} - ${number}`,
            description:
              `Sample property listing ${number} in ${locality}, ${location.city}. ` +
              'This is synthetic test data created for performance testing.',
            city: location.city,
            locality,
            address: `${locality}, ${location.city}`,
            price:
              listingType === ListingType.RENT
                ? 10000 + (number % 40000)
                : 2500000 + (number % 15000000),
            bedrooms,
            bathrooms: Math.min(bedrooms, 4),
            areaSqft: 500 + (number % 2500),
            propertyType: propertyTypes[number % propertyTypes.length],
            listingType,
            images: [],
            amenities: ['Parking', 'Water supply'],
          };
        },
      );

      await prisma.property.createMany({ data });

      console.log(
        `Inserted ${start + batchCount} / ${missingCount} properties`,
      );
    }
  }

  const finalCount = await prisma.property.count();
  console.log(`Seed complete. Total properties: ${finalCount}`);
  console.log('Demo login: demo@realestate.test / Demo@12345');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
