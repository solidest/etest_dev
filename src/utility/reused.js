import {
    sdk
} from '../../sdk/sdk';
import db from '../doc/workerdb';

async function _get_etlcode(id, name, memo) {
    let doc = await db.get('src', id);
    if (!doc || !doc.content) {
        return null;
    } else {
        switch (doc.kind) {
            case 'device':
                return sdk.converter.device_dev2etl(doc.content, name, memo);
        }
    }
    return null;
}

function _get_devobj(kind, code) {
    let ast = sdk.parser.parse_etl(code)[0];
    switch (kind) {
        case 'device':
            return sdk.converter.device_etl2dev(ast);
    }
    return null;
}

async function get_reused(id, kind, name, memo) {
    try {
        let code = await _get_etlcode(id, name, memo);
        let obj = _get_devobj(kind, code);
        return obj ? {
            kind,
            name,
            memo,
            code,
        } : null;
    } catch (error) {
        return null;
    }
}

export default {
    get_reused,
}