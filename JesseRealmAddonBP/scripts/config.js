// Enables `printDebug` messages to chat.
export const DEBUG = false;
// Enables `printLog` messages to content logs.
export const CONTENT_LOG = false;
// What character(s) to use to define the beginning of custom commands.
export const COMMAND_PREFIX = ';';
// How many operations can be recorded in a player's history.
export const MAX_HISTORY_SIZE = 25;
// Whether a player's selection is drawn by default.
export const DRAW_SELECTION = true;
// 0 - DISABLED    - Undo and redo will be disabled.
// 1 - FAST     - The cuboid region of each operation will be recorded.
// 2 - ACCURATE    - Individual blocks in each operation will be recorded.
export const HISTORY_MODE = 2; // How to handle general undo and redo
export const BRUSH_HISTORY_MODE = 1; // How to handle brush undo and redo
// How long until a previously active builder's session gets deleted.
// This includes their undo redo history.
export const TICKS_TO_DELETE_SESSION = 12000; // 10 minutes
// Whether commands executed by items print their messages to the action bar or the chat.
export const PRINT_TO_ACTION_BAR = true;
// The default item used for marking selection wand.
export const WAND_ITEM = 'minecraft:wooden_axe';
// The default item used for the navigation wand.
export const NAV_WAND_ITEM = 'minecraft:ender_pearl';
// THe distance the navwand, among other tools and commands, traces for a block of interest.
export const NAV_WAND_DISTANCE = 64;
// The maximum brush radius allowed.
export const MAX_BRUSH_RADIUS = 6;
// The default amount of blocks that can be "potentially" affected within a single operation.
export const DEFAULT_CHANGE_LIMIT = -1;
// The absolute change limit that can be set from the ;limit command. 
// Bypassed with "worldedit.limit.unlimited" permission.
export const MAX_CHANGE_LIMIT = -1;
// The version of WorldEdit (do not change)
export const VERSION = '0.5.0';