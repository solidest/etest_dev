
import shortid from 'shortid';

class OneofItem {
    constructor(data, parent, condition) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), kind: 'oneofitem', condition: condition||'', items: []};
        this.children = load(this.data.items, this);
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return this.data.name;
    }
    get kind() {
        return this.data.kind;
    }
    full_name() {
        return this.parent.full_name();
    }
    lastIndex(draw_items) {
        if(this.children.length === 0) {
            return draw_items.findIndex(it => it=== this);
        } else {
            return this.children[this.children.length-1].lastIndex(draw_items);
        }
    }
    save_append(items) {
        let its = [];
        this.children.forEach(child => child.save_append(its));
        this.data.items = its;
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.children.forEach(child => {
            child.draw_append(items, level, deep);
        })
    }
    list_append(items) {
        items.push(this);
        this.children.forEach(child => {
            child.list_append(items);
        });
    }
    // insert_children(segs, draw_items) {
    //     let draw_idx = this.lastIndex(draw_items);
    //     segs.forEach(seg => seg.level++);
    //     this.children.push(...segs);
    //     draw_items.splice(draw_idx+1, 0, ...segs);
    // }
}

class Oneof{
    constructor(data, parent) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), kind: 'oneof', items: []};
        let self = this;
        let branchs = [];
        if(this.data.items) {
            this.data.items.forEach(it => {
                branchs.push(new OneofItem(it, self));
            });
        }
        this.children = branchs;
        this.check_children();
        this.select(this.data.sel_id);
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return '';
    }
    get kind() {
        return this.data.kind;
    }
    get memo() {
        return '';
    }
    full_name() {
        return this.parent.full_name();
    }
    check_children() {
        if(this.children.length===0) {
            this.children.push(new OneofItem(null, this));
            this.selected = this.children[0];
        }
    }
    select(id) {
        if(this.children.length === 0) {
            this.selected = null;
        } else {
            let sel = this.children.find(it => it.id === id);
            this.selected = sel || this.children[0];
        }
    }
    to_code() {
        return JSON.stringify(this.data);
    }
    lastIndex(draw_items) {
        if(this.selected) {
            return this.selected.lastIndex(draw_items);
        }
        return draw_items.findIndex(it => it=== this);
    }
    save_append(items) {
        let its = [];
        this.children.forEach(ch => ch.save_append(its));
        this.data.items = its;
        this.data.sel_id = this.selected ? this.selected.id : null;
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.level = level;
        this.deep = deep;
        items.push(this);
        if(this.selected) {
            this.selected.draw_append(items, level, deep+1);
        }
    }
    list_append(items) {
        items.push(this);
        this.children.forEach(child => {
            child.list_append(items);
        });
    }
    add_oneof_branchs(count) {
        for(let i=0; i<count; i++) {
            let br = new OneofItem(null, self);
            br.level = this.level;
            br.deep = this.deep + 1;
            this.children.push(br);
        }
        this.select();
    }
    // insert_children(segs, draw_items) {
    //     this.check_children();
    //     this.selected.insert_children(segs, draw_items);
    // }
}

class Segments {
    constructor(data, parent, name) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), name: name||'', kind: 'segments', items: []};
        this.children = load(this.data.items, this);
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return this.data.name;
    }
    get memo() {
        return this.data.memo;
    }
    get kind() {
        return this.data.kind;
    }
    full_name() {
        let pn = this.parent.full_name();
        return pn ? `${pn}.${this.name}` : this.name;
    }
    to_code() {
        return JSON.stringify(this.data);
    }
    lastIndex(draw_items) {
        if(this.children.length === 0) {
            return draw_items.findIndex(it => it=== this);
        } else {
            return this.children[this.children.length-1].lastIndex(draw_items);
        }
    }
    save_append(items) {
        let its = [];
        this.children.forEach(child => child.save_append(its));
        this.data.items = its;
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.level = level;
        this.deep = deep;
        items.push(this);
        this.children.forEach(child => {
            child.draw_append(items, level+1, deep);
        });
    }
    list_append(items) {
        items.push(this);
        this.children.forEach(child => {
            child.list_append(items);
        });
    }
    insert_children(segs, draw_items) {
        let draw_idx = this.lastIndex(draw_items);
        segs.forEach(seg => seg.level++);
        this.children.push(...segs);
        draw_items.splice(draw_idx+1, 0, ...segs);
    }
    update_name_memo(name, memo){
        this.data.name = name || '';
        this.data.memo = memo || '';
    }
}

class Segment {
    constructor(data, parent, name) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), name: name||'', kind: 'segment'};
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return this.data.name;
    }
    get memo() {
        return this.data.memo;
    }
    get kind() {
        return this.data.kind;
    }
    full_name() {
        return `${this.parent.full_name()}.${this.name}`
    }
    to_code() {
        return JSON.stringify(this.data);
    }
    lastIndex(draw_items) {
        return draw_items.findIndex(it => it=== this);
    }
    save_append(items) {
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.level = level;
        this.deep = deep;
        items.push(this);
    }
    list_append(items) {
        items.push(this);
    }
    update_name_memo(name, memo){
        this.data.name = name || '';
        this.data.memo = memo || '';
    }
}

class Frame {
    constructor() {
        this.children = [];
        this.draw_items = [];
    }

    full_name() {
        return null;
    }

    save() {
        let items = [];
        this.children.forEach(it => {
            it.save_append(items);
        });
        return items;
    }

    draw() {
        let items = [];
        this.children.forEach(it => {
            it.draw_append(items, 0, 0);
        });
        return items;
    }
}

function load(items, parent) {
    if(!items || items.length === 0) {
        return [];
    }
    let objs = [];
    if(!parent) {
        parent = new Frame(objs);        
    }

    items.forEach(it => {
        if(it.kind === 'segment') {
            objs.push(new Segment(it, parent));
        } else if(it.kind === 'segments') {
            objs.push(new Segments(it, parent));
        } else if(it.kind === 'oneof') {
            objs.push(new Oneof(it, parent));
        } else {
            console.log('TODO', it);
        }
    });
    return objs;
}

function load_frm(items) {
    let frm = new Frame();
    frm.children = load(items, frm);
    frm.draw_items = frm.draw();
    return frm;
}

function insert_brother_(segs, frm, parent, seg, offset) {
    let data_idx, draw_idx
    if(seg) {
        data_idx = parent.children.findIndex(it => it === seg) + offset;
        if(offset===0) {
            draw_idx = frm.draw_items.findIndex(it => it===seg);           
        } else {
            draw_idx = seg.lastIndex(frm.draw_items)+1;
        }

    } else {
        data_idx = parent.children.length;
        draw_idx = frm.draw_items.length ;
    }

    parent.children.splice(data_idx, 0, ...segs);
    frm.draw_items.splice(draw_idx, 0, ...segs);
}

function insert(frm, seg, kind, name, count, offset) {
    count = count || 1;
    if(count<1) {
        count = 1;
    } else {
        if(count>20) {
            count = 20;
        }
    }
    let parent = seg ? seg.parent : frm;
    let segs = [];
    if(kind === 'oneof') {
        let nseg = new Oneof(null, parent);
        nseg.level = seg ? seg.level : 0;
        nseg.deep = seg ? seg.deep : 0;
        nseg.add_oneof_branchs(count);
        segs.push(nseg);
    } else {
        for(let i=0; i<count; i++) {
            let n = name || '';
            let nseg = null;
            if(count>1) {
                n = (name||'') + (i+1);
            }
            if(kind === 'segment') {
                nseg = new Segment(null, parent, n);
            } else if(kind === 'segments') {
                nseg = new Segments(null, parent, n);
            }
            if(!nseg){
                console.log('TODO', kind);
            } else {
                nseg.level = seg ? seg.level : 0;
                nseg.deep = seg ? seg.deep : 0;
                segs.push(nseg);
            }
        }        
    }

    if(segs.length === 0) {
        return null;
    }

    if(offset===-100) {
        seg.insert_children(segs, frm.draw_items);
    } else {
        insert_brother_(segs, frm, parent, seg, offset);
    }
    return segs;
}

function remove(seg, draw_items) {
    let items = [];
    seg.list_append(items);
    let index = seg.parent.children.findIndex(it => it === seg);
    seg.parent.splice(index, 1);
    items.forEach(item => {
        let idx = draw_items.findIndex(it => it === item);
        if(idx>=0) {
            draw_items.splice(idx, 1);
        }
    })
}

export default { load_frm, insert, remove, }
