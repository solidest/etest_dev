import db from '../feature/m_db';
import helper from '../helper/helper';
import yaml from 'js-yaml';
import fs  from 'fs';

// 导出监控面板
function _exp_panel(clone_doc, clone_el, filename){
    if(!clone_doc || !clone_doc.content || !clone_doc.content.layout){
        return;
    }
    clone_doc.content.id = clone_el.id
    clone_doc.content.name = clone_el.name
    try{
        fs.writeFileSync(filename, yaml.dump(clone_doc.content), 'utf8');
    }catch{
        return;
    }
}
//  导出设备
function _exp_device(clone_doc, clone_el, filename){
    if (!clone_doc || !clone_el){
        return;
    }
    let list = []
    let name = clone_el.name
    let dict_start = {level: 0, text: `device ${name} {`}
    list.push(dict_start)
    if (clone_doc.content.items){
        clone_doc.content.items.forEach(items => {
            // let config = '{'
            // for (let i in items.config){
            //     if(items.config[i] == null && items.config[i]){

            //     }
            //     config = config + i + ": " + items.config[i] + ', '
            // }
    
            let config1 = JSON.stringify(items.config)
            let it_obj = {level: 4, text: `${items.kind} ${items.name} ${config1}`}
            list.push(it_obj)
        });
    }
    let dict_end = {level: 0, text: `}`}
    list.push(dict_end)
    _writefile(list, filename)
}

// 根据设备id获取设备名称
function _exp_device_name(device_id){
    let clone_el = helper.deep_copy(db.load('device', device_id))
    return clone_el.name
}
// 导出拓扑关系
function _exp_topology(clone_doc, clone_el, filename){
    if (!clone_el || !clone_doc.content){
        return;
    }
    let list = []
    let name = clone_el.name
    let dict_start = {level: 0, text: `topology ${name} {`}
    list.push(dict_start)
    let co = []
    _mapping(list, clone_doc, co)
    _linking(list,clone_doc, co )
    _binding(list, clone_doc, co)
    _writefile(list, filename)
    
    // _writefile(_binding(_linking(_mapping(list, clone_doc, co), clone_doc, co), clone_doc, co),filename)
}

// 写入文件
function _writefile(list, filename){
    let codes = list.map(it =>' '.repeat(it.level) + it.text)
    codes.join('\n')
    let str = ''
    codes.forEach(it=>{
        str = str + it + "\n"
    })
    fs.appendFile(filename, str, function(err){
        if (err){
            return err;
        }
    });
}

// 写入binding
function _binding(list, clone_doc, co){
    if (clone_doc.content.binding){
        let binding_start = {level: 4, text: `binding: {`}
        list.push(binding_start)
        clone_doc.content.binding.forEach(obj =>{
            let obj_id = obj.conn_id
            let li = []
            co.forEach(it =>{
                it.conn_list.forEach(item =>{
                    if (obj_id == item.conn_id){
                        li.push( it.name + '.' + item.coon_name )
                    }
                })
                
            })
            let lik = {level: 8, text: `${li.join(', ')}: '${obj.uri}',`}
            list.push(lik)
        })
        let map = {level: 4, text: `}`}
        list.push(map)
    }
    list.push({level:0,text:'}'})
    return list
}
// 写入mapping
function _mapping(list, clone_doc, co){
    let mapping_start = {level: 4, text: `mapping: {`}
    list.push(mapping_start)
    if (clone_doc.content.mapping){
        let list_etest = []
        let list_uut = []
        clone_doc.content.mapping.forEach(it =>{
            let device_name = _exp_device_name(it.dev_id)
            let conn_doc =  helper.deep_copy(db.load('doc', it.dev_id));
            let connlist = []
            conn_doc.content.items.forEach(it =>{
                let connkey = {'coon_name': it.name, 'conn_id': it.id}
                connlist.push(connkey)
            })
            let dev_list = {'conn_list': connlist, 'name':device_name}
            co.push(dev_list)
            if (it.used == 'etest'){
                list_etest.push(device_name)
            }else{
                list_uut.push(device_name)
            }
        })
        let etest_obj = {level: 8, text: `etest: [${list_etest.join(', ')}],`}
        let uut_obj = {level: 8, text: `uut: [${list_uut.join(', ')}],`}
        list.push(etest_obj)
        list.push(uut_obj)
    }
    let map = {level: 4, text: `}`}
    list.push(map)
    return list
}
// 写入lingking
function _linking(list, clone_doc, co){
    if (clone_doc.content.linking){
        let mapping_start = {level: 4, text: `linking: {`}
        list.push(mapping_start)
        let idx = 0
        clone_doc.content.linking.forEach(it =>{
            let name = ("link_" + idx++).toString()
            let li = []
            it.conns.forEach(id =>{
                co.forEach(it =>{
                    it.conn_list.forEach(item =>{
                        if (id == item.conn_id){
                            li.push(' ' + it.name + '.' + item.coon_name )
                        }
                    })
                   
                })
            })
            let lik = {level: 8, text: `${name}: [${li}],`}
            list.push(lik)
        })
        let map = {level: 4, text: `}`}
        list.push(map)
    }
    return list
}
// 导出协议oneof
function _exp_oneof(items, num, list){
    num = num + 4
    items.forEach(item =>{
        if (item.kind == 'oneof'){
            item.items.forEach(it =>{
                if (it.kind == 'oneofitem'){
                    list.push({level: num, text: `${item.kind} (${it.condition}) {`}) 
                    _exp_oneof(it.items, num, list)
                    list.push({level: num, text:`}`})
                }
            }) 
        }
        if (item.kind == 'segment'){
            _exp_protocol_segment(item, list, num)
        }
        if (item.kind == 'segments'){
            _exp_protocol_array(item, list, num)
            _exp_oneof(item.items, num, list)
            list.push({level: num, text:`}`})
        }
    })
    

}

//判断协议的数组长度
function _exp_protocol_array(item, list, num){
    if (item.arrlen){
        list.push({level: num, text: `${item.kind} ${item.name} [${item.arrlen}] {`})
    }
    else{
        list.push({level: num, text: `${item.kind} ${item.name} {`})
    }
}

// 判断协议段是否为字符串
function _exp_protocol_string1(item, list, num){
    if (item.length && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}, endwith: ${item.endwith}}`})
    }else if(item.length && item.endwith == null){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}}`}) 
    }else if(item.length == null && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, endwith: ${item.endwith}}`}) 
    }else{
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}}`})
    }
}

function _exp_protocol_string2(item, list, num){
    if (item.length && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}, endwith: ${item.endwith}}`})
    }else if(item.length && item.endwith == null){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}}`}) 
    }else if(item.length == null && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, endwith: ${item.endwith}}`}) 
    }else{
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}'}`})
    }
}

function _exp_protocol_string3(item, list, num){
    if (item.length && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}, endwith: ${item.endwith}}`})
    }else if(item.length && item.endwith == null){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}}`}) 
    }else if(item.length == null && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, endwith: ${item.endwith}}`}) 
    }else{
        list.push({level: num, text:`${item.kind} ${item.name} {parser: '${item.parser}', autovalue: ${item.autovalue}}`})
    }
}

function _exp_protocol_string4(item, list, num){
    if (item.length && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}, endwith: ${item.endwith}}`})
    }else if(item.length && item.endwith == null){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}}`}) 
    }else if(item.length == null && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, endwith: ${item.endwith}}`}) 
    }else{
        list.push({level: num, text:`${item.kind} ${item.name} {parser: '${item.parser}'}`})
    }
}

function _exp_protocol_segment(item, list, num){
    if (item.autovalue && item.arrlen){
        _exp_protocol_string1(item, list, num)
    }
    else if(item.autovalue == false && item.arrlen){
        _exp_protocol_string2(item, list, num)
    }
    else if(item.autovalue && item.arrlen == null){
        _exp_protocol_string3(item, list, num)
    }
    else{
        _exp_protocol_string4(item, list, num)
    }
}
// 导出协议
function _exp_protocol(clone_doc, clone_el, filename){
    if (!clone_doc || !clone_el){
        return;
    }
    let list = []
    list.push({level: 0, text: `${clone_doc.kind} ${clone_el.name} {`})
    _exp_oneof(clone_doc.content.items, 0, list)
    list.push({level: 0, text:'}'})
    _writefile(list, filename)

}
// 导出program
function _exp_program(clone_doc, clone_el, filename){
    
}
function export_element(kind, id, path) {
    let clone_el = helper.deep_copy(db.load(kind, id));
    let clone_doc =  helper.deep_copy(db.load('doc', id));
    if(clone_doc) {
        switch (kind) {
            case 'device':
                _exp_device(clone_doc, clone_el, path);
                break;
            case 'topology':
                _exp_topology(clone_doc, clone_el, path)
                break;
            case 'panel':
                _exp_panel(clone_doc, clone_el, path)
                break
            case 'protocol':
                _exp_protocol(clone_doc, clone_el, path)
                break
            case 'simu':
                _exp_simu(clone_doc)
                break
            case 'program':
                _exp_program(clone_doc)
                break
            default:
                console.error('TODO export', kind);
                break;
        }        
    }

}

export default {
    export_element,
}