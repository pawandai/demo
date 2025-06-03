import { Product } from "../../models/Product.js";
import { sequelize } from "../../database/connection.js";
import { DataTypes } from "sequelize";
import { logger } from "../../utils/logger.js";

export const seedProducts = async () => {
  try {
    // First, check if the products table exists
    logger.info("Checking if products table exists...");
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();

    if (!tables.includes("products")) {
      logger.info("Products table does not exist, creating it...");

      // Create the products table
      await queryInterface.createTable("products", {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        in_price: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 0,
        },
        article_no: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        unit: {
          type: DataTypes.STRING(20),
          allowNull: true,
          defaultValue: "st",
        },
        in_stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        category: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        image_url: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      });

      logger.info("Products table created successfully");
    } else {
      logger.info("Products table already exists");
    }

    // Now sync the model with the existing table
    await Product.sync({ alter: true });

    // Check if products already exist
    const productCount = await Product.count();

    if (productCount > 0) {
      logger.info(
        `Products table already has ${productCount} records, skipping seed`
      );
      return;
    }

    logger.info("Seeding products table...");

    // Create demo products
    const demoProducts = [];

    // Electronics category
    demoProducts.push(
      {
        name: "MacBook Pro 16-inch",
        description: "Apple M2 Pro chip, 16GB RAM, 512GB SSD, Space Gray",
        price: 26999,
        in_price: 22000,
        article_no: "APPL-MBP16-001",
        category: "Electronics",
        in_stock: 15,
        unit: "st",
        image_url: "https://picsum.photos/id/0/600/400",
      },
      {
        name: "iPhone 15 Pro",
        description:
          "A17 Pro chip, 256GB, Titanium, 6.1-inch Super Retina XDR display",
        price: 13990,
        in_price: 11500,
        article_no: "APPL-IP15P-001",
        category: "Electronics",
        in_stock: 42,
        unit: "st",
        image_url: "https://picsum.photos/id/1/600/400",
      },
      {
        name: "Samsung Galaxy S23 Ultra",
        description:
          "Snapdragon 8 Gen 2, 12GB RAM, 256GB, 6.8-inch Dynamic AMOLED",
        price: 11990,
        in_price: 10000,
        article_no: "SMSNG-S23U-001",
        category: "Electronics",
        in_stock: 28,
        unit: "st",
        image_url: "https://picsum.photos/id/2/600/400",
      },
      {
        name: "Sony WH-1000XM5",
        description:
          "Wireless Noise Cancelling Headphones with Auto Noise Cancelling Optimizer",
        price: 3990,
        in_price: 3300,
        article_no: "SONY-WH1000XM5-001",
        category: "Electronics",
        in_stock: 35,
        unit: "st",
        image_url: "https://picsum.photos/id/3/600/400",
      },
      {
        name: "iPad Air",
        description: "M1 chip, 10.9-inch Liquid Retina display, 256GB, Wi-Fi",
        price: 7999,
        in_price: 6700,
        article_no: "APPL-IPAD-001",
        category: "Electronics",
        in_stock: 22,
        unit: "st",
        image_url: "https://picsum.photos/id/4/600/400",
      }
    );

    // Office supplies
    demoProducts.push(
      {
        name: "IKEA MARKUS Office Chair",
        description: "Ergonomic swivel chair with high back and lumbar support",
        price: 1995,
        in_price: 1650,
        article_no: "IKEA-MARK-001",
        category: "Office",
        in_stock: 8,
        unit: "st",
        image_url: "https://picsum.photos/id/5/600/400",
      },
      {
        name: "HP LaserJet Pro MFP",
        description:
          "Multifunction printer with scan, copy and wireless printing capabilities",
        price: 4499,
        in_price: 3750,
        article_no: "HP-LJPRO-001",
        category: "Office",
        in_stock: 12,
        unit: "st",
        imageUrl: "https://picsum.photos/id/6/600/400",
      },
      {
        name: "Moleskine Classic Notebook",
        description: "Hard cover, ruled pages, large (13 x 21 cm), black",
        price: 249,
        in_price: 200,
        article_no: "MLSK-NTBK-001",
        category: "Office",
        in_stock: 85,
        unit: "st",
        imageUrl: "https://picsum.photos/id/7/600/400",
      }
    );

    // Software & Services
    demoProducts.push(
      {
        name: "Microsoft 365 Business",
        description:
          "Annual subscription for Word, Excel, PowerPoint, Outlook, and more",
        price: 1199,
        in_price: 1000,
        article_no: "MS-365-BUS-001",
        category: "Software",
        in_stock: 999,
        unit: "license",
        imageUrl: "https://picsum.photos/id/8/600/400",
      },
      {
        name: "Adobe Creative Cloud",
        description: "Complete plan with 20+ creative desktop and mobile apps",
        price: 5999,
        in_price: 5000,
        article_no: "ADBE-CC-001",
        category: "Software",
        in_stock: 999,
        unit: "license",
        imageUrl: "https://picsum.photos/id/9/600/400",
      },
      {
        name: "Website Design Service",
        description:
          "Professional website design with responsive layout and SEO optimization",
        price: 15000,
        in_price: 12500,
        article_no: "SRV-WEBDES-001",
        category: "Services",
        in_stock: 100,
        unit: "hour",
        imageUrl: "https://picsum.photos/id/10/600/400",
      },
      {
        name: "IT Consultation",
        description: "Expert IT consultation for business technology solutions",
        price: 1200,
        in_price: 1000,
        article_no: "SRV-ITCON-001",
        category: "Services",
        in_stock: 200,
        unit: "hour",
        imageUrl: "https://picsum.photos/id/11/600/400",
      }
    );

    // Furniture
    demoProducts.push(
      {
        name: "Standing Desk Pro",
        description:
          "Electric height-adjustable desk with memory settings, 160x80cm",
        price: 5499,
        in_price: 4600,
        article_no: "FURN-DESK-001",
        category: "Furniture",
        in_stock: 5,
        unit: "st",
        imageUrl: "https://picsum.photos/id/12/600/400",
      },
      {
        name: "Conference Table",
        description: "Large meeting table for 10 people, oak finish, 300x120cm",
        price: 8999,
        in_price: 7500,
        article_no: "FURN-TABLE-001",
        category: "Furniture",
        in_stock: 3,
        unit: "st",
        imageUrl: "https://picsum.photos/id/13/600/400",
      }
    );

    // Networking
    demoProducts.push(
      {
        name: "Ubiquiti UniFi AP Pro",
        description: "Enterprise Wi-Fi 6 access point for businesses",
        price: 2499,
        in_price: 2100,
        article_no: "NTWK-UAPRO-001",
        category: "Networking",
        in_stock: 18,
        unit: "st",
        imageUrl: "https://picsum.photos/id/14/600/400",
      },
      {
        name: "Cisco Catalyst Switch",
        description: "48-port managed gigabit switch with PoE+",
        price: 11999,
        in_price: 10000,
        article_no: "NTWK-CSCO-001",
        category: "Networking",
        in_stock: 7,
        unit: "st",
        imageUrl: "https://picsum.photos/id/15/600/400",
      }
    );

    // Add more products to reach 30
    for (let i = 1; i <= 15; i++) {
      demoProducts.push({
        name: `Demo Product ${i}`,
        description: `This is a demo product description for product ${i}`,
        price: 500 + i * 100,
        sku: `DEMO-PROD-${String(i).padStart(3, "0")}`,
        category:
          i % 3 === 0
            ? "Electronics"
            : i % 2 === 0
            ? "Office"
            : "Miscellaneous",
        in_stock: 10 + i * 2,
        unit: "st",
        imageUrl: `https://picsum.photos/id/${15 + i}/600/400`,
      });
    }

    // Insert all products - use fields that match the database column names
    await Product.bulkCreate(demoProducts);

    logger.info(`Successfully seeded ${demoProducts.length} products`);
  } catch (error) {
    logger.error(`Error seeding products: ${error.message}`);
    throw error;
  }
};
