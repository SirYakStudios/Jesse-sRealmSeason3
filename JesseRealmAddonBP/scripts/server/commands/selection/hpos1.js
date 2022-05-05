import { PlayerUtil } from './../../modules/player_util.js';
import { commandList } from '../command_list.js';
import { setPos1 } from './pos1.js';
const registerInformation = {
    name: 'hpos1',
    permission: 'worldedit.selection.hpos',
    description: 'commands.wedit:hpos1.description'
};
commandList['hpos1'] = [registerInformation, (session, builder, args) => {
        const hit = PlayerUtil.traceForBlock(builder);
        if (!hit) {
            throw 'commands.wedit:jumpto.none';
        }
        return setPos1(session, hit);
    }];