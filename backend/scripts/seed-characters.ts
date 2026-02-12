import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 12 Chibi Character Definitions
const characters = [
    // Row 1 - Warriors & Adventurers
    {
        key: 'blaze',
        name: 'Blaze',
        description: 'A fierce warrior with blazing speed and determination. Orange-haired adventurer with red armor.',
        color: '#FF6B35',
        theme: 'Warriors & Adventurers',
        classType: 'Warrior',
        avatarUrl: '/assets/characters/blaze.png',
        startingXP: 0
    },
    {
        key: 'aqua',
        name: 'Aqua',
        description: 'A mystical mage channeling the power of water and wisdom. Cyan-haired spellcaster.',
        color: '#00D4FF',
        theme: 'Warriors & Adventurers',
        classType: 'Mage',
        avatarUrl: '/assets/characters/aqua.png',
        startingXP: 50
    },
    {
        key: 'shadow',
        name: 'Shadow',
        description: 'Silent and deadly rogue who strikes from the darkness. Master of stealth.',
        color: '#2C3E50',
        theme: 'Warriors & Adventurers',
        classType: 'Rogue',
        avatarUrl: '/assets/characters/shadow.png',
        startingXP: 0
    },
    {
        key: 'steel',
        name: 'Steel',
        description: 'Armored robot warrior with unbreakable defense and advanced technology.',
        color: '#5DADE2',
        theme: 'Warriors & Adventurers',
        classType: 'Tank',
        avatarUrl: '/assets/characters/steel.png',
        startingXP: 0
    },
    // Row 2 - Mages & Spellcasters
    {
        key: 'mystic',
        name: 'Mystic',
        description: 'Ancient wizard wielding arcane arts and blue magic. Wears a pointed hat.',
        color: '#3498DB',
        theme: 'Mages & Spellcasters',
        classType: 'Mage',
        avatarUrl: '/assets/characters/mystic.png',
        startingXP: 50
    },
    {
        key: 'rose',
        name: 'Rose',
        description: 'Enchanting mage with pink magic and a cheerful spirit. Brings joy to the battlefield.',
        color: '#FF69B4',
        theme: 'Mages & Spellcasters',
        classType: 'Support',
        avatarUrl: '/assets/characters/rose.png',
        startingXP: 50
    },
    {
        key: 'frost',
        name: 'Frost',
        description: 'Ice warrior combining martial prowess with freezing magic. Light blue hair and red scarf.',
        color: '#89CFF0',
        theme: 'Mages & Spellcasters',
        classType: 'Warrior',
        avatarUrl: '/assets/characters/frost.png',
        startingXP: 0
    },
    {
        key: 'dusk',
        name: 'Dusk',
        description: 'Mysterious figure wielding twilight powers. Yellow hair with dark mystical abilities.',
        color: '#F39C12',
        theme: 'Mages & Spellcasters',
        classType: 'Mage',
        avatarUrl: '/assets/characters/dusk.png',
        startingXP: 50
    },
    // Row 3 - Specialists & Experts
    {
        key: 'ember',
        name: 'Ember',
        description: 'Fire mage conjuring flaming orbs and burning passion. Dark-haired pyromancer.',
        color: '#E74C3C',
        theme: 'Specialists & Experts',
        classType: 'Mage',
        avatarUrl: '/assets/characters/ember.png',
        startingXP: 50
    },
    {
        key: 'void',
        name: 'Void',
        description: 'Purple hooded enigma channeling the power of the void and blue magic.',
        color: '#9B59B6',
        theme: 'Specialists & Experts',
        classType: 'Mage',
        avatarUrl: '/assets/characters/void.png',
        startingXP: 50
    },
    {
        key: 'spark',
        name: 'Spark',
        description: 'Enthusiastic and energetic character radiating positive energy. Orange-haired dynamo.',
        color: '#FF8C00',
        theme: 'Specialists & Experts',
        classType: 'Support',
        avatarUrl: '/assets/characters/spark.png',
        startingXP: 0
    },
    {
        key: 'sage',
        name: 'Sage',
        description: 'Wise character wielding green magical elements and ancient knowledge.',
        color: '#27AE60',
        theme: 'Specialists & Experts',
        classType: 'Support',
        avatarUrl: '/assets/characters/sage.png',
        startingXP: 50
    }
];

async function seedCharacters() {
    console.log('Seeding characters...');

    for (const char of characters) {
        await prisma.character.upsert({
            where: { key: char.key },
            update: char,
            create: char
        });
        console.log(`✓ Created/Updated character: ${char.name}`);
    }

    console.log('✓ All characters seeded successfully!');
}

async function main() {
    try {
        await seedCharacters();
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
