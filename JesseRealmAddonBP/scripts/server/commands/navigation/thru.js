import { Server } from './../../../library/Minecraft.js';
import { RawText } from './../../modules/rawtext.js';
import { PlayerUtil } from './../../modules/player_util.js';
import { Cardinal } from './../../modules/directions.js';
import { printLocation } from '../../util.js';
import { commandList } from '../command_list.js';
const registerInformation = {
    name: 'thru',
    permission: 'worldedit.navigation.thru.command',
    description: 'commands.wedit:thru.description'
};
commandList['thru'] = [registerInformation, (session, builder, args) => {
        const dimension = builder.dimension;
        const blockLoc = PlayerUtil.getBlockLocation(builder);
        const dir = new Cardinal().getDirection(builder);
        function isSpaceEmpty(loc) {
            return dimension.getBlock(loc).isEmpty && dimension.getBlock(loc.offset(0, 1, 0)).isEmpty;
        }
        let testLoc = blockLoc.offset(dir.x, dir.y, dir.z);
        if (isSpaceEmpty(testLoc)) {
            throw RawText.translate('commands.wedit:thru.none');
        }
        let canGoThrough = false;
        for (let i = 0; i < (dir.y == 0 ? 3 : 4); i++) {
            testLoc = testLoc.offset(dir.x, dir.y, dir.z);
            if (isSpaceEmpty(testLoc)) {
                canGoThrough = true;
                break;
            }
        }
        if (canGoThrough) {
            Server.runCommand(`tp @s ${printLocation(testLoc, false)}`, builder);
            return RawText.translate('commands.wedit:thru.explain');
        }
        else {
            throw RawText.translate('commands.wedit:thru.obstructed');
        }
    }];