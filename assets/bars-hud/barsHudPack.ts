/** Auto-generated from Bars_1780811398003.png */
export const BARS_HUD_PACK = {
  "sheet": "Bars_1780811398003.png",
  "count": 202,
  "categoryCounts": {
    "unit-frames": 9,
    "boss-frames": 4,
    "ally-frames": 3,
    "enemy-frames": 2,
    "health-bars": 6,
    "mana-bars": 9,
    "stamina-bars": 7,
    "fillers": 51,
    "overhead": 9,
    "structure": 1,
    "icons-gems": 94,
    "misc": 9
  },
  "gameWiring": {
    "playerUnitFrame": {
      "frame": "unit-frames/unit_frame_*.png",
      "healthFill": "fillers/health_fill_*.png",
      "manaFill": "fillers/mana_fill_*.png",
      "staminaFill": "fillers/stamina_fill_*.png"
    },
    "partyAllyFrame": "ally-frames/*",
    "targetEnemyFrame": "enemy-frames/*",
    "bossTargetFrame": "boss-frames/*",
    "overheadSelectable": {
      "friendHp": "overhead/overhead_health_* or overhead_ally_*",
      "friendMp": "overhead/overhead_mana_*",
      "enemyHp": "overhead/overhead_enemy_* or overhead_health_*",
      "interaction": "Billboard above unit; pointer raycast \u2192 select entity id"
    },
    "structureEntityHp": {
      "assets": "structure/*",
      "use": "benches, claim flags, ships, buildables \u2014 same fill% pattern as unit HP"
    },
    "barAssembly": "Background = *_frame / unit_frame; fill layer width = pct * trackWidth (or 9-slice)"
  },
  "sprites": [
    {
      "id": "ally_frame_001",
      "file": "ally-frames/ally_frame_001.png",
      "category": "ally-frames",
      "role": "ally_frame",
      "tags": [
        "simple_top",
        "green",
        "frame",
        "portrait_slot",
        "selectable",
        "friendly"
      ],
      "w": 153,
      "h": 44,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "stamina_vial_001",
      "file": "stamina-bars/stamina_vial_001.png",
      "category": "stamina-bars",
      "role": "stamina_vial",
      "tags": [
        "simple_top",
        "green",
        "vertical",
        "fill"
      ],
      "w": 12,
      "h": 48,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_001",
      "file": "icons-gems/gem_001.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "simple_top",
        "red",
        "decor"
      ],
      "w": 4,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "mana_fill_001",
      "file": "fillers/mana_fill_001.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "simple_top",
        "blue",
        "thin",
        "fill"
      ],
      "w": 104,
      "h": 9,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_002",
      "file": "icons-gems/gem_002.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "simple_top",
        "red",
        "decor"
      ],
      "w": 4,
      "h": 22,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "overhead_mana_001",
      "file": "overhead/overhead_mana_001.png",
      "category": "overhead",
      "role": "overhead_mana",
      "tags": [
        "simple_top",
        "blue",
        "overhead",
        "selectable"
      ],
      "w": 44,
      "h": 9,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "overhead_mana_002",
      "file": "overhead/overhead_mana_002.png",
      "category": "overhead",
      "role": "overhead_mana",
      "tags": [
        "simple_top",
        "blue",
        "overhead",
        "selectable"
      ],
      "w": 44,
      "h": 9,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_003",
      "file": "icons-gems/gem_003.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "simple_top",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_004",
      "file": "icons-gems/gem_004.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "simple_top",
        "red",
        "decor"
      ],
      "w": 5,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_005",
      "file": "icons-gems/gem_005.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "simple_top",
        "blue",
        "decor"
      ],
      "w": 5,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_006",
      "file": "icons-gems/gem_006.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "simple_top",
        "green",
        "decor"
      ],
      "w": 5,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "misc_001",
      "file": "misc/misc_001.png",
      "category": "misc",
      "role": "misc",
      "tags": [
        "simple_top",
        "red",
        "a1.4"
      ],
      "w": 112,
      "h": 80,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_001",
      "file": "fillers/health_fill_001.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "simple_top",
        "red",
        "thin",
        "fill"
      ],
      "w": 98,
      "h": 3,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "health_fill_002",
      "file": "fillers/health_fill_002.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "simple_top",
        "red",
        "thin",
        "fill"
      ],
      "w": 102,
      "h": 13,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "misc_002",
      "file": "misc/misc_002.png",
      "category": "misc",
      "role": "misc",
      "tags": [
        "simple_top",
        "red",
        "a1.9"
      ],
      "w": 22,
      "h": 10,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_007",
      "file": "icons-gems/gem_007.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "simple_top",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 22,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "stamina_fill_001",
      "file": "fillers/stamina_fill_001.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "simple_top",
        "green",
        "thin",
        "fill"
      ],
      "w": 31,
      "h": 3,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_002",
      "file": "fillers/mana_fill_002.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "simple_top",
        "blue",
        "thin",
        "fill"
      ],
      "w": 38,
      "h": 3,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_002",
      "file": "fillers/stamina_fill_002.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "simple_top",
        "green",
        "thin",
        "fill"
      ],
      "w": 38,
      "h": 3,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_008",
      "file": "icons-gems/gem_008.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "wing_gold",
        "green",
        "decor"
      ],
      "w": 19,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "boss_frame_001",
      "file": "boss-frames/boss_frame_001.png",
      "category": "boss-frames",
      "role": "boss_frame",
      "tags": [
        "wing_gold",
        "red",
        "frame",
        "portrait_slot",
        "selectable",
        "elite"
      ],
      "w": 252,
      "h": 43,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_003",
      "file": "fillers/health_fill_003.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "wing_gold",
        "red",
        "thin",
        "fill"
      ],
      "w": 43,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_003",
      "file": "fillers/mana_fill_003.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "wing_gold",
        "blue",
        "thin",
        "fill"
      ],
      "w": 42,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "health_fill_004",
      "file": "fillers/health_fill_004.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "wing_gold",
        "red",
        "thin",
        "fill"
      ],
      "w": 73,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_004",
      "file": "fillers/mana_fill_004.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "wing_gold",
        "blue",
        "thin",
        "fill"
      ],
      "w": 36,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_003",
      "file": "fillers/stamina_fill_003.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "wing_gold",
        "green",
        "thin",
        "fill"
      ],
      "w": 36,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "health_fill_005",
      "file": "fillers/health_fill_005.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "wing_gold",
        "red",
        "thin",
        "fill"
      ],
      "w": 72,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_005",
      "file": "fillers/mana_fill_005.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "wing_gold",
        "blue",
        "thin",
        "fill"
      ],
      "w": 35,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_004",
      "file": "fillers/stamina_fill_004.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "wing_gold",
        "green",
        "thin",
        "fill"
      ],
      "w": 36,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "boss_frame_002",
      "file": "boss-frames/boss_frame_002.png",
      "category": "boss-frames",
      "role": "boss_frame",
      "tags": [
        "feather_purple",
        "blue",
        "frame",
        "portrait_slot",
        "selectable",
        "hostile",
        "elite"
      ],
      "w": 177,
      "h": 52,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "mana_vial_001",
      "file": "mana-bars/mana_vial_001.png",
      "category": "mana-bars",
      "role": "mana_vial",
      "tags": [
        "feather_purple",
        "blue",
        "vertical",
        "fill"
      ],
      "w": 10,
      "h": 41,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "overhead_mana_003",
      "file": "overhead/overhead_mana_003.png",
      "category": "overhead",
      "role": "overhead_mana",
      "tags": [
        "feather_purple",
        "blue",
        "overhead",
        "selectable"
      ],
      "w": 134,
      "h": 19,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_009",
      "file": "icons-gems/gem_009.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "feather_purple",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_010",
      "file": "icons-gems/gem_010.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "feather_purple",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 22,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_011",
      "file": "icons-gems/gem_011.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "feather_purple",
        "red",
        "decor"
      ],
      "w": 7,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_012",
      "file": "icons-gems/gem_012.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "feather_purple",
        "blue",
        "decor"
      ],
      "w": 6,
      "h": 2,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_006",
      "file": "fillers/health_fill_006.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "feather_purple",
        "red",
        "thin",
        "fill"
      ],
      "w": 120,
      "h": 8,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_013",
      "file": "icons-gems/gem_013.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "feather_purple",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_014",
      "file": "icons-gems/gem_014.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "feather_purple",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "mana_fill_006",
      "file": "fillers/mana_fill_006.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "feather_purple",
        "blue",
        "thin",
        "fill"
      ],
      "w": 84,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_005",
      "file": "fillers/stamina_fill_005.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "feather_purple",
        "green",
        "thin",
        "fill"
      ],
      "w": 80,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_007",
      "file": "fillers/mana_fill_007.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "feather_purple",
        "blue",
        "thin",
        "fill"
      ],
      "w": 83,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_006",
      "file": "fillers/stamina_fill_006.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "feather_purple",
        "green",
        "thin",
        "fill"
      ],
      "w": 82,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "boss_frame_003",
      "file": "boss-frames/boss_frame_003.png",
      "category": "boss-frames",
      "role": "boss_frame",
      "tags": [
        "hex_gold",
        "red",
        "frame",
        "portrait_slot",
        "selectable",
        "elite"
      ],
      "w": 97,
      "h": 50,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "boss_frame_004",
      "file": "boss-frames/boss_frame_004.png",
      "category": "boss-frames",
      "role": "boss_frame",
      "tags": [
        "hex_gold",
        "red",
        "frame",
        "portrait_slot",
        "selectable",
        "elite"
      ],
      "w": 177,
      "h": 55,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_015",
      "file": "icons-gems/gem_015.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "hex_gold",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_016",
      "file": "icons-gems/gem_016.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "hex_gold",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 22,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_017",
      "file": "icons-gems/gem_017.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "hex_gold",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_018",
      "file": "icons-gems/gem_018.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "hex_gold",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 22,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_019",
      "file": "icons-gems/gem_019.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "hex_gold",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_020",
      "file": "icons-gems/gem_020.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "hex_gold",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_frame_001",
      "file": "health-bars/health_frame_001.png",
      "category": "health-bars",
      "role": "health_frame",
      "tags": [
        "hex_gold",
        "red",
        "framed_bar"
      ],
      "w": 26,
      "h": 6,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_021",
      "file": "icons-gems/gem_021.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "hex_gold",
        "blue",
        "decor"
      ],
      "w": 19,
      "h": 6,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_022",
      "file": "icons-gems/gem_022.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "hex_gold",
        "green",
        "decor"
      ],
      "w": 12,
      "h": 6,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_007",
      "file": "fillers/health_fill_007.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "hex_gold",
        "red",
        "thin",
        "fill"
      ],
      "w": 67,
      "h": 6,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_frame_001",
      "file": "mana-bars/mana_frame_001.png",
      "category": "mana-bars",
      "role": "mana_frame",
      "tags": [
        "hex_gold",
        "blue",
        "framed_bar"
      ],
      "w": 31,
      "h": 6,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "stamina_frame_001",
      "file": "stamina-bars/stamina_frame_001.png",
      "category": "stamina-bars",
      "role": "stamina_frame",
      "tags": [
        "hex_gold",
        "green",
        "framed_bar"
      ],
      "w": 33,
      "h": 6,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_008",
      "file": "fillers/health_fill_008.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "tech_blue",
        "red",
        "thin",
        "fill"
      ],
      "w": 67,
      "h": 6,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_frame_002",
      "file": "mana-bars/mana_frame_002.png",
      "category": "mana-bars",
      "role": "mana_frame",
      "tags": [
        "tech_blue",
        "blue",
        "framed_bar"
      ],
      "w": 31,
      "h": 6,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "stamina_frame_002",
      "file": "stamina-bars/stamina_frame_002.png",
      "category": "stamina-bars",
      "role": "stamina_frame",
      "tags": [
        "tech_blue",
        "green",
        "framed_bar"
      ],
      "w": 33,
      "h": 6,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "mana_vial_002",
      "file": "mana-bars/mana_vial_002.png",
      "category": "mana-bars",
      "role": "mana_vial",
      "tags": [
        "tech_blue",
        "blue",
        "vertical",
        "fill"
      ],
      "w": 22,
      "h": 67,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "health_frame_006",
      "file": "health-bars/health_frame_006.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "tech_blue",
        "blue",
        "frame",
        "portrait_slot",
        "selectable",
        "player_or_npc"
      ],
      "w": 141,
      "h": 23,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "unit_frame_002",
      "file": "unit-frames/unit_frame_002.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "tech_blue",
        "blue",
        "frame",
        "portrait_slot",
        "selectable",
        "player_or_npc"
      ],
      "w": 168,
      "h": 47,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_023",
      "file": "icons-gems/gem_023.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 10,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_024",
      "file": "icons-gems/gem_024.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 10,
      "h": 10,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "mana_fill_008",
      "file": "fillers/mana_fill_008.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "tech_blue",
        "blue",
        "thin",
        "fill"
      ],
      "w": 44,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_007",
      "file": "fillers/stamina_fill_007.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "tech_blue",
        "green",
        "thin",
        "fill"
      ],
      "w": 40,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_025",
      "file": "icons-gems/gem_025.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 8,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_026",
      "file": "icons-gems/gem_026.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 10,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_027",
      "file": "icons-gems/gem_027.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 10,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_028",
      "file": "icons-gems/gem_028.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "blue",
        "decor"
      ],
      "w": 5,
      "h": 2,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_029",
      "file": "icons-gems/gem_029.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "blue",
        "decor"
      ],
      "w": 5,
      "h": 2,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_030",
      "file": "icons-gems/gem_030.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "blue",
        "decor"
      ],
      "w": 4,
      "h": 2,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_031",
      "file": "icons-gems/gem_031.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "green",
        "decor"
      ],
      "w": 5,
      "h": 2,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_032",
      "file": "icons-gems/gem_032.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "green",
        "decor"
      ],
      "w": 4,
      "h": 2,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_009",
      "file": "fillers/health_fill_009.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "tech_blue",
        "red",
        "thin",
        "fill"
      ],
      "w": 140,
      "h": 13,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "misc_003",
      "file": "misc/misc_003.png",
      "category": "misc",
      "role": "misc",
      "tags": [
        "tech_blue",
        "red",
        "a0.5"
      ],
      "w": 35,
      "h": 68,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_033",
      "file": "icons-gems/gem_033.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 8,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_034",
      "file": "icons-gems/gem_034.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 10,
      "h": 5,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_035",
      "file": "icons-gems/gem_035.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 5,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_036",
      "file": "icons-gems/gem_036.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 7,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_037",
      "file": "icons-gems/gem_037.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "blue",
        "decor"
      ],
      "w": 6,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_038",
      "file": "icons-gems/gem_038.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "blue",
        "decor"
      ],
      "w": 7,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_039",
      "file": "icons-gems/gem_039.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "blue",
        "decor"
      ],
      "w": 6,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_040",
      "file": "icons-gems/gem_040.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "green",
        "decor"
      ],
      "w": 7,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_041",
      "file": "icons-gems/gem_041.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "green",
        "decor"
      ],
      "w": 6,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_042",
      "file": "icons-gems/gem_042.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_043",
      "file": "icons-gems/gem_043.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "tech_blue",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 22,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "unit_frame_003",
      "file": "unit-frames/unit_frame_003.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "tech_blue",
        "red",
        "frame",
        "portrait_slot",
        "selectable",
        "player_or_npc"
      ],
      "w": 147,
      "h": 50,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "overhead_health_001",
      "file": "overhead/overhead_health_001.png",
      "category": "overhead",
      "role": "overhead_health",
      "tags": [
        "tech_blue",
        "red",
        "overhead",
        "selectable"
      ],
      "w": 113,
      "h": 18,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_010",
      "file": "fillers/health_fill_010.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "diamond_gold",
        "red",
        "thin",
        "fill"
      ],
      "w": 103,
      "h": 11,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "health_fill_011",
      "file": "fillers/health_fill_011.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "diamond_gold",
        "red",
        "thin",
        "fill"
      ],
      "w": 104,
      "h": 11,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_vial_003",
      "file": "mana-bars/mana_vial_003.png",
      "category": "mana-bars",
      "role": "mana_vial",
      "tags": [
        "diamond_gold",
        "blue",
        "vertical",
        "fill"
      ],
      "w": 19,
      "h": 48,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "unit_frame_004",
      "file": "unit-frames/unit_frame_004.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "diamond_gold",
        "blue",
        "frame",
        "portrait_slot",
        "selectable",
        "player_or_npc"
      ],
      "w": 163,
      "h": 40,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "unit_frame_005",
      "file": "unit-frames/unit_frame_005.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "diamond_gold",
        "blue",
        "frame",
        "portrait_slot",
        "selectable",
        "player_or_npc"
      ],
      "w": 136,
      "h": 36,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_044",
      "file": "icons-gems/gem_044.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_012",
      "file": "fillers/health_fill_012.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "steel_grey",
        "red",
        "thin",
        "fill"
      ],
      "w": 122,
      "h": 6,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "health_fill_013",
      "file": "fillers/health_fill_013.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "steel_grey",
        "red",
        "thin",
        "fill"
      ],
      "w": 119,
      "h": 6,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_045",
      "file": "icons-gems/gem_045.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 20,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_046",
      "file": "icons-gems/gem_046.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_047",
      "file": "icons-gems/gem_047.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "green",
        "decor"
      ],
      "w": 8,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_048",
      "file": "icons-gems/gem_048.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "green",
        "decor"
      ],
      "w": 8,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "stamina_fill_008",
      "file": "fillers/stamina_fill_008.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "steel_grey",
        "green",
        "thin",
        "fill"
      ],
      "w": 53,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_009",
      "file": "fillers/mana_fill_009.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "steel_grey",
        "blue",
        "thin",
        "fill"
      ],
      "w": 53,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_049",
      "file": "icons-gems/gem_049.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_050",
      "file": "icons-gems/gem_050.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 6,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_frame_002",
      "file": "health-bars/health_frame_002.png",
      "category": "health-bars",
      "role": "health_frame",
      "tags": [
        "steel_grey",
        "red",
        "framed_bar"
      ],
      "w": 27,
      "h": 6,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_051",
      "file": "icons-gems/gem_051.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 6,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_052",
      "file": "icons-gems/gem_052.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "red",
        "decor"
      ],
      "w": 13,
      "h": 6,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_053",
      "file": "icons-gems/gem_053.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "red",
        "decor"
      ],
      "w": 11,
      "h": 5,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "stamina_fill_009",
      "file": "fillers/stamina_fill_009.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "steel_grey",
        "green",
        "thin",
        "fill"
      ],
      "w": 53,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_010",
      "file": "fillers/mana_fill_010.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "steel_grey",
        "blue",
        "thin",
        "fill"
      ],
      "w": 49,
      "h": 4,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_054",
      "file": "icons-gems/gem_054.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "blue",
        "decor"
      ],
      "w": 8,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_055",
      "file": "icons-gems/gem_055.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "blue",
        "decor"
      ],
      "w": 4,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_056",
      "file": "icons-gems/gem_056.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "blue",
        "decor"
      ],
      "w": 8,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_057",
      "file": "icons-gems/gem_057.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "steel_grey",
        "blue",
        "decor"
      ],
      "w": 8,
      "h": 4,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "mana_vial_004",
      "file": "mana-bars/mana_vial_004.png",
      "category": "mana-bars",
      "role": "mana_vial",
      "tags": [
        "steel_grey",
        "blue",
        "vertical",
        "fill"
      ],
      "w": 11,
      "h": 48,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "unit_frame_006",
      "file": "unit-frames/unit_frame_006.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "steel_grey",
        "blue",
        "frame",
        "portrait_slot",
        "selectable",
        "player_or_npc"
      ],
      "w": 200,
      "h": 57,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "overhead_mana_004",
      "file": "overhead/overhead_mana_004.png",
      "category": "overhead",
      "role": "overhead_mana",
      "tags": [
        "skull_dark",
        "blue",
        "overhead",
        "selectable"
      ],
      "w": 105,
      "h": 20,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "misc_004",
      "file": "misc/misc_004.png",
      "category": "misc",
      "role": "misc",
      "tags": [
        "skull_dark",
        "red",
        "a0.3"
      ],
      "w": 5,
      "h": 24,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_058",
      "file": "icons-gems/gem_058.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "red",
        "decor"
      ],
      "w": 5,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_059",
      "file": "icons-gems/gem_059.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "green",
        "decor"
      ],
      "w": 10,
      "h": 2,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_060",
      "file": "icons-gems/gem_060.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "blue",
        "decor"
      ],
      "w": 13,
      "h": 2,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_014",
      "file": "fillers/health_fill_014.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "skull_dark",
        "red",
        "thin",
        "fill"
      ],
      "w": 99,
      "h": 9,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_061",
      "file": "icons-gems/gem_061.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_062",
      "file": "icons-gems/gem_062.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_063",
      "file": "icons-gems/gem_063.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "red",
        "decor"
      ],
      "w": 5,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_064",
      "file": "icons-gems/gem_064.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "blue",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_065",
      "file": "icons-gems/gem_065.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 8,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "mana_fill_011",
      "file": "fillers/mana_fill_011.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "skull_dark",
        "blue",
        "thin",
        "fill"
      ],
      "w": 38,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_010",
      "file": "fillers/stamina_fill_010.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "skull_dark",
        "green",
        "thin",
        "fill"
      ],
      "w": 38,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_vial_002",
      "file": "stamina-bars/stamina_vial_002.png",
      "category": "stamina-bars",
      "role": "stamina_vial",
      "tags": [
        "skull_dark",
        "green",
        "vertical",
        "fill"
      ],
      "w": 14,
      "h": 40,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_012",
      "file": "fillers/mana_fill_012.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "skull_dark",
        "blue",
        "thin",
        "fill"
      ],
      "w": 38,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_011",
      "file": "fillers/stamina_fill_011.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "skull_dark",
        "green",
        "thin",
        "fill"
      ],
      "w": 38,
      "h": 2,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "misc_005",
      "file": "misc/misc_005.png",
      "category": "misc",
      "role": "misc",
      "tags": [
        "skull_dark",
        "red",
        "a0.3"
      ],
      "w": 5,
      "h": 24,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_066",
      "file": "icons-gems/gem_066.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_067",
      "file": "icons-gems/gem_067.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "skull_dark",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "ally_frame_002",
      "file": "ally-frames/ally_frame_002.png",
      "category": "ally-frames",
      "role": "ally_frame",
      "tags": [
        "banner_green",
        "green",
        "frame",
        "portrait_slot",
        "selectable",
        "friendly"
      ],
      "w": 365,
      "h": 48,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_015",
      "file": "fillers/health_fill_015.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "banner_green",
        "red",
        "thin",
        "fill"
      ],
      "w": 49,
      "h": 8,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_vial_003",
      "file": "stamina-bars/stamina_vial_003.png",
      "category": "stamina-bars",
      "role": "stamina_vial",
      "tags": [
        "banner_green",
        "red",
        "vertical",
        "fill"
      ],
      "w": 11,
      "h": 48,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_vial_004",
      "file": "stamina-bars/stamina_vial_004.png",
      "category": "stamina-bars",
      "role": "stamina_vial",
      "tags": [
        "banner_green",
        "red",
        "vertical",
        "fill"
      ],
      "w": 11,
      "h": 48,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_vial_005",
      "file": "stamina-bars/stamina_vial_005.png",
      "category": "stamina-bars",
      "role": "stamina_vial",
      "tags": [
        "banner_green",
        "red",
        "vertical",
        "fill"
      ],
      "w": 11,
      "h": 48,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "misc_006",
      "file": "misc/misc_006.png",
      "category": "misc",
      "role": "misc",
      "tags": [
        "banner_green",
        "red",
        "a1.9"
      ],
      "w": 55,
      "h": 27,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "ally_frame_003",
      "file": "ally-frames/ally_frame_003.png",
      "category": "ally-frames",
      "role": "ally_frame",
      "tags": [
        "banner_green",
        "red",
        "frame",
        "portrait_slot",
        "selectable",
        "friendly"
      ],
      "w": 107,
      "h": 39,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "mana_fill_013",
      "file": "fillers/mana_fill_013.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "banner_green",
        "blue",
        "thin",
        "fill"
      ],
      "w": 49,
      "h": 9,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_068",
      "file": "icons-gems/gem_068.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "banner_green",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 22,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_016",
      "file": "fillers/health_fill_016.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "banner_green",
        "red",
        "thin",
        "fill"
      ],
      "w": 49,
      "h": 8,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_014",
      "file": "fillers/mana_fill_014.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "beige_seg",
        "blue",
        "thin",
        "fill"
      ],
      "w": 49,
      "h": 9,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_069",
      "file": "icons-gems/gem_069.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "beige_seg",
        "blue",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_070",
      "file": "icons-gems/gem_070.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "beige_seg",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_071",
      "file": "icons-gems/gem_071.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "beige_seg",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 8,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_017",
      "file": "fillers/health_fill_017.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "beige_seg",
        "red",
        "thin",
        "fill"
      ],
      "w": 49,
      "h": 8,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "structure_frame_001",
      "file": "structure/structure_frame_001.png",
      "category": "structure",
      "role": "structure_frame",
      "tags": [
        "beige_seg",
        "blue",
        "frame",
        "portrait_slot",
        "selectable",
        "bench",
        "claim",
        "ship"
      ],
      "w": 236,
      "h": 54,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "mana_vial_005",
      "file": "mana-bars/mana_vial_005.png",
      "category": "mana-bars",
      "role": "mana_vial",
      "tags": [
        "beige_seg",
        "blue",
        "vertical",
        "fill"
      ],
      "w": 11,
      "h": 40,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "misc_007",
      "file": "misc/misc_007.png",
      "category": "misc",
      "role": "misc",
      "tags": [
        "beige_seg",
        "red",
        "a0.3"
      ],
      "w": 5,
      "h": 24,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_072",
      "file": "icons-gems/gem_072.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "beige_seg",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 10,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_073",
      "file": "icons-gems/gem_073.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "beige_seg",
        "red",
        "decor"
      ],
      "w": 10,
      "h": 10,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_074",
      "file": "icons-gems/gem_074.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "beige_seg",
        "red",
        "decor"
      ],
      "w": 5,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_075",
      "file": "icons-gems/gem_075.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "beige_seg",
        "blue",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_076",
      "file": "icons-gems/gem_076.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "beige_seg",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 8,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "mana_fill_015",
      "file": "fillers/mana_fill_015.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "beige_seg",
        "blue",
        "thin",
        "fill"
      ],
      "w": 49,
      "h": 9,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "health_fill_018",
      "file": "fillers/health_fill_018.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "beige_seg",
        "red",
        "thin",
        "fill"
      ],
      "w": 49,
      "h": 8,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "misc_008",
      "file": "misc/misc_008.png",
      "category": "misc",
      "role": "misc",
      "tags": [
        "purple_gem",
        "red",
        "a0.6"
      ],
      "w": 58,
      "h": 97,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "mana_fill_016",
      "file": "fillers/mana_fill_016.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "purple_gem",
        "blue",
        "thin",
        "fill"
      ],
      "w": 49,
      "h": 9,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "unit_frame_007",
      "file": "unit-frames/unit_frame_007.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "purple_gem",
        "red",
        "frame",
        "portrait_slot",
        "selectable"
      ],
      "w": 124,
      "h": 45,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "health_frame_003",
      "file": "health-bars/health_frame_003.png",
      "category": "health-bars",
      "role": "health_frame",
      "tags": [
        "purple_gem",
        "red",
        "framed_bar"
      ],
      "w": 39,
      "h": 8,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_077",
      "file": "icons-gems/gem_077.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "purple_gem",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 20,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "unit_frame_008",
      "file": "unit-frames/unit_frame_008.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "purple_gem",
        "red",
        "frame",
        "portrait_slot",
        "selectable"
      ],
      "w": 107,
      "h": 28,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_078",
      "file": "icons-gems/gem_078.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "purple_gem",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_079",
      "file": "icons-gems/gem_079.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "purple_gem",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 8,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_080",
      "file": "icons-gems/gem_080.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "purple_gem",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 8,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "mana_frame_003",
      "file": "mana-bars/mana_frame_003.png",
      "category": "mana-bars",
      "role": "mana_frame",
      "tags": [
        "purple_gem",
        "blue",
        "framed_bar"
      ],
      "w": 39,
      "h": 8,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "unit_frame_009",
      "file": "unit-frames/unit_frame_009.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "purple_gem",
        "red",
        "frame",
        "portrait_slot",
        "selectable"
      ],
      "w": 136,
      "h": 60,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_081",
      "file": "icons-gems/gem_081.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "purple_gem",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 10,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_frame_004",
      "file": "health-bars/health_frame_004.png",
      "category": "health-bars",
      "role": "health_frame",
      "tags": [
        "purple_gem",
        "red",
        "framed_bar"
      ],
      "w": 39,
      "h": 10,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_082",
      "file": "icons-gems/gem_082.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "purple_gem",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_083",
      "file": "icons-gems/gem_083.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "purple_gem",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 9,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "overhead_health_002",
      "file": "overhead/overhead_health_002.png",
      "category": "overhead",
      "role": "overhead_health",
      "tags": [
        "purple_gem",
        "red",
        "overhead",
        "selectable"
      ],
      "w": 96,
      "h": 20,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "health_frame_005",
      "file": "health-bars/health_frame_005.png",
      "category": "health-bars",
      "role": "health_frame",
      "tags": [
        "compact_hud",
        "red",
        "framed_bar"
      ],
      "w": 39,
      "h": 10,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "unit_frame_010",
      "file": "unit-frames/unit_frame_010.png",
      "category": "health-bars",`n      "role": "health_frame",
      "tags": [
        "compact_hud",
        "blue",
        "frame",
        "portrait_slot",
        "selectable",
        "player_or_npc"
      ],
      "w": 171,
      "h": 98,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "mana_frame_004",
      "file": "mana-bars/mana_frame_004.png",
      "category": "mana-bars",
      "role": "mana_frame",
      "tags": [
        "compact_hud",
        "blue",
        "framed_bar"
      ],
      "w": 39,
      "h": 10,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "gem_084",
      "file": "icons-gems/gem_084.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "compact_hud",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 22,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_085",
      "file": "icons-gems/gem_085.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "compact_hud",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 22,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_086",
      "file": "icons-gems/gem_086.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "compact_hud",
        "red",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_019",
      "file": "fillers/health_fill_019.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "compact_hud",
        "red",
        "thin",
        "fill"
      ],
      "w": 54,
      "h": 3,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_012",
      "file": "fillers/stamina_fill_012.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "compact_hud",
        "green",
        "thin",
        "fill"
      ],
      "w": 54,
      "h": 3,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_017",
      "file": "fillers/mana_fill_017.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "compact_hud",
        "blue",
        "thin",
        "fill"
      ],
      "w": 54,
      "h": 3,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "gem_087",
      "file": "icons-gems/gem_087.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "compact_hud",
        "blue",
        "decor"
      ],
      "w": 3,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_088",
      "file": "icons-gems/gem_088.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "compact_hud",
        "red",
        "decor"
      ],
      "w": 10,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_089",
      "file": "icons-gems/gem_089.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "compact_hud",
        "blue",
        "decor"
      ],
      "w": 10,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_090",
      "file": "icons-gems/gem_090.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "compact_hud",
        "green",
        "decor"
      ],
      "w": 9,
      "h": 3,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_091",
      "file": "icons-gems/gem_091.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "bottom_hud",
        "red",
        "decor"
      ],
      "w": 9,
      "h": 6,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_092",
      "file": "icons-gems/gem_092.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "bottom_hud",
        "blue",
        "decor"
      ],
      "w": 9,
      "h": 6,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_093",
      "file": "icons-gems/gem_093.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "bottom_hud",
        "green",
        "decor"
      ],
      "w": 9,
      "h": 6,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "overhead_health_003",
      "file": "overhead/overhead_health_003.png",
      "category": "overhead",
      "role": "overhead_health",
      "tags": [
        "bottom_hud",
        "red",
        "overhead",
        "selectable"
      ],
      "w": 73,
      "h": 19,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "overhead_health_004",
      "file": "overhead/overhead_health_004.png",
      "category": "overhead",
      "role": "overhead_health",
      "tags": [
        "bottom_hud",
        "red",
        "overhead",
        "selectable"
      ],
      "w": 73,
      "h": 19,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "overhead_health_005",
      "file": "overhead/overhead_health_005.png",
      "category": "overhead",
      "role": "overhead_health",
      "tags": [
        "bottom_hud",
        "red",
        "overhead",
        "selectable"
      ],
      "w": 73,
      "h": 19,
      "selectable": true,
      "nineSliceHint": false
    },
    {
      "id": "misc_009",
      "file": "misc/misc_009.png",
      "category": "misc",
      "role": "misc",
      "tags": [
        "bottom_hud",
        "red",
        "a0.3"
      ],
      "w": 5,
      "h": 24,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "gem_094",
      "file": "icons-gems/gem_094.png",
      "category": "icons-gems",
      "role": "gem",
      "tags": [
        "bottom_hud",
        "red",
        "decor"
      ],
      "w": 5,
      "h": 12,
      "selectable": false,
      "nineSliceHint": false
    },
    {
      "id": "health_fill_020",
      "file": "fillers/health_fill_020.png",
      "category": "fillers",
      "role": "health_fill",
      "tags": [
        "bottom_hud",
        "red",
        "thin",
        "fill"
      ],
      "w": 52,
      "h": 6,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "stamina_fill_013",
      "file": "fillers/stamina_fill_013.png",
      "category": "fillers",
      "role": "stamina_fill",
      "tags": [
        "bottom_hud",
        "green",
        "thin",
        "fill"
      ],
      "w": 52,
      "h": 6,
      "selectable": false,
      "nineSliceHint": true
    },
    {
      "id": "mana_fill_018",
      "file": "fillers/mana_fill_018.png",
      "category": "fillers",
      "role": "mana_fill",
      "tags": [
        "bottom_hud",
        "blue",
        "thin",
        "fill"
      ],
      "w": 52,
      "h": 6,
      "selectable": false,
      "nineSliceHint": true
    }
  ]
} as const;
