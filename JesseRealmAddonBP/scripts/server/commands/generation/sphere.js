import { RawText } from './../../modules/rawtext.js';
import { PlayerUtil } from './../../modules/player_util.js';
import { SphereShape } from '../../shapes/sphere.js';
import { commandList } from '../command_list.js';
const registerInformation = {
    name: 'sphere',
    permission: 'worldedit.generation.sphere',
    description: 'commands.wedit:sphere.description',
    usage: [
        {
            flag: 'h'
        }, {
            flag: 'r'
        }, {
            name: 'pattern',
            type: 'Pattern'
        }, {
            subName: '_x',
            args: [
                {
                    name: 'radii',
                    type: 'float',
                    range: [0.01, null]
                }
            ]
        }, {
            subName: '_xy',
            args: [
                {
                    name: 'radiiXZ',
                    type: 'float',
                    range: [0.01, null]
                }, {
                    name: 'radiiY',
                    type: 'float',
                    range: [0.01, null]
                }
            ]
        }, {
            subName: '_xyz',
            args: [
                {
                    name: 'radiiX',
                    type: 'float',
                    range: [0.01, null]
                }, {
                    name: 'radiiY',
                    type: 'float',
                    range: [0.01, null]
                }, {
                    name: 'radiiZ',
                    type: 'float',
                    range: [0.01, null]
                }
            ]
        }
    ]
};
commandList['sphere'] = [registerInformation, (session, builder, args) => {
        let pattern = args.get('pattern');
        let radii;
        let isHollow = args.has('h');
        let isRaised = args.has('r');
        if (args.has('_x'))
            radii = [args.get('radii'), args.get('radii'), args.get('radii')];
        else if (args.has('_xy'))
            radii = [args.get('radiiXZ'), args.get('radiiY'), args.get('radiiXZ')];
        else
            radii = [args.get('radiiX'), args.get('radiiY'), args.get('radiiZ')];
        const loc = PlayerUtil.getBlockLocation(builder).offset(0, isRaised ? radii[1] : 0, 0);
        const sphereShape = new SphereShape(...radii);
        const count = sphereShape.generate(loc, pattern, null, session, { 'hollow': isHollow });
        return RawText.translate('commands.blocks.wedit:created').with(`${count}`);
    }];