
// interface UnitBonus {
//     [key: string]: number;
// }

// Define the types for your enemy configurations
interface UnitConfig {
    name: string;
    spriteSheet: string;
    attack: number;
    defense: number;
    health: number;
    moves: number;
    bonus: Array<{ [key: string]: number }>;
    // bonus: UnitBonus[];
}

export const enemyConfigs = {
    // 'Axeman': { 
    //     name: 'Axeman',
    //     spriteSheet: "light infantry - elite7",
    //     attack: 25,
    //     defense: 1,
    //     health: 100,
    //     moves: 2,        
    //     bonus: [
    //         { "Archer": 4 },
    //         { "Swordsman": 3 }
    //     ],
    // },
    // 'MilitiaAxeman': { 
    //     name: 'MilitiaAxeman',
    //     spriteSheet: "light infantry - elite7",
    //     attack: 30,
    //     defense: 2,
    //     health: 120,
    //     moves: 2,
    //     bonus: [
    //         { "Archer": 4 },
    //         { "Swordsman": 3 }
    //     ],
    // },
    'Archer': { 
        name: 'Archer',
        spriteSheet: "64 light infantry3",
        attack: 7,
        defense: 0,
        health: 100,
        moves: 2,
        bonus: [
            { "Spearman": 12 },
            { "Archer": 4 },
            { "Swordsman": 2 },
            { "Axeman": 5 }
        ],
        projectile: "Arrow",
        index: 0
    },
    'Knight': { 
        name: 'Knight',
        spriteSheet: "64 cavalry - heavy1",
        attack: 32,
        defense: 6,
        health: 150,
        moves: 3,
        bonus: [
            { "Archer": 30 },
            { "Axeman": 12 },
            { "Swordsman": 8 },
            { "Spearman": -14 },
        ], 
        projectile: "None",
        index: 1
    },
    'Spearman': { 
        name: 'Spearman',
        spriteSheet: "64 heavy infantry1",
        attack: 15,
        defense: 2,
        health: 100,
        moves: 1,
        bonus: [
            { "Knight": 20 }
        ],
         projectile: "None",
         index: 2
    },
    'Swordsman': { 
        name: 'Swordsman',
        spriteSheet: "64 heavy infantry - elite8",
        attack: 20,
        defense: 3,
        health: 100,
        moves: 1,
        bonus: [
            { "Spearman": 15 },
            { "Archer": 20 },
            { "Swordsman": 10}
        ],
         projectile: "None",
         index: 3
        
    },
};

