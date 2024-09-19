import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: "user@user.com",
    phone: "621234567890",
    password:
      "$2b$10$bi9U2Fg.H4AkMx4JwBhqk.VrmnraUUaT.sHw0vovDYdZWGsiaMchK",
    verifiedAt: null,
    profile: {
      create: {
        username: "user",
        name: "user",
        image: "https://i.pravatar.cc/150?u=user",
        bio: "Halo saya user",
      },
    },
  },
];

const destinationData: Prisma.DestinationCreateInput[] = [
  {
    name: "Pantai Kuta",
    location: "Kuta, Bali",
    description:
      "Pantai Kuta adalah salah satu tempat wisata yang paling terkenal di Bali. Pantai ini terletak di sebelah barat Denpasar, ibukota Bali, dan merupakan salah satu tempat yang paling sering dikunjungi oleh wisatawan asing.",
    address:
      "Jl. Pantai Kuta, Kuta, Kabupaten Badung, Bali",
    hours: "24 jam",
    prices: ["Rp 100.000"],
    contact: "081234567890",
    facilities: ["Toilet, Warung, Tempat Parkir"],
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
  {
    name: "Pantai Sanur",
    location: "Sanur, Bali",
    description:
      "Pantai Sanur adalah salah satu pantai yang terletak di sebelah timur Denpasar, ibukota Bali. Pantai ini terkenal dengan keindahan matahari terbitnya.",
    address:
      "Jl. Pantai Sanur, Sanur, Kabupaten Gianyar, Bali",
    hours: "24 jam",
    prices: ["Rp 50.000"],
    contact: "081234567890",
    facilities: ["Toilet, Warung, Tempat Parkir"],
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
  {
    name: "Pantai Lovina",
    location: "Lovina, Bali",
    description:
      "Pantai Lovina adalah salah satu pantai yang terletak di sebelah utara Bali. Pantai ini terkenal dengan keindahan matahari terbenamnya.",
    address:
      "Jl. Pantai Lovina, Lovina, Kabupaten Buleleng, Bali",
    hours: "24 jam",
    prices: ["Rp 75.000"],
    contact: "081234567890",
    facilities: ["Toilet, Warung, Tempat Parkir"],
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
];

const eventData: Prisma.EventCreateInput[] = [
  {
    name: "Bali Kite Festival",
    description:
      "Bali Kite Festival adalah festival layang-layang yang diadakan setiap tahun di Bali. Festival ini diikuti oleh peserta dari berbagai daerah di Bali.",
    address: "Padang Galak Beach, Sanur, Bali",
    hours: "08.00 - 17.00",
    prices: ["Gratis"],
    contact: "081234567890",
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
  {
    name: "Bali Arts Festival",
    description:
      "Bali Arts Festival adalah festival seni yang diadakan setiap tahun di Bali. Festival ini diikuti oleh seniman dari berbagai daerah di Bali.",
    address: "Taman Werdhi Budaya, Denpasar, Bali",
    hours: "08.00 - 17.00",
    prices: ["Gratis"],
    contact: "081234567890",
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
  {
    name: "Bali Food Festival",
    description:
      "Bali Food Festival adalah festival makanan yang diadakan setiap tahun di Bali. Festival ini diikuti oleh pedagang makanan dari berbagai daerah di Bali.",
    address: "Lapangan Puputan Badung, Denpasar, Bali",
    hours: "08.00 - 17.00",
    prices: ["Gratis"],
    contact: "081234567890",
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  for (const d of destinationData) {
    const destination = await prisma.destination.create({
      data: d,
    });
    console.log(
      `Created destination with id: ${destination.id}`
    );
  }
  for (const e of eventData) {
    const event = await prisma.event.create({
      data: e,
    });
    console.log(`Created event with id: ${event.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
