
import parser from 'luaparse';
import yaml from 'js-yaml';

const KIND = 'program';

class Lua {
    constructor(data, proj) {
        this.data = data;
        this.proj = proj;
    }

    get id() {
        return this.data.id;
    }

    get name() {
        return this.data.name;
    }

    _option_check() {

        if(!this.data.content || !this.data.content.option) {
            return;
        }
        let opt = this.data.content.option;
        if(opt.vars) {
            try {
                yaml.safeLoad(opt.vars, 'utf8');
            } catch (error) {
                this.proj.pushError('输入参数设置错误', KIND, this.id, -1);
            }
        }

        // if(!opt.topology) {
        //     this.proj.pushError('未设置连接拓扑', KIND, this.id, -1);
        // }
    }

    _entry_check(ast) {
        if(this.data.content && this.data.content.option && this.data.content.option.lib) {
            return;
        }
        let entry = false;
        if(ast.type === 'Chunk' && ast.body) {
            ast.body.forEach(a => {
                if(a.type === 'FunctionDeclaration' && a.identifier.name === 'entry') {
                    entry = true;
                }
            })
        }
        if(!entry) {
            this.proj.pushError('缺少entry入口函数', KIND, this.id, -1);
        }
    }

    _parser_check(script) {

        try {
            let ast = parser.parse(script, {luaVersion: '5.3'});
            if(!ast) {
                this.proj.pushError('语法错误', KIND, this.id, -1);
            } else {
                this._entry_check(ast);
            }
        } catch (error) {
            console.log(error.message)
            this.proj.pushError(error.message, KIND, this.id, error.line);
        }
    }

    check() {
        if(!this.data.content) {
            return;
        }
        let script = this.data.content.script;
        if(!script || !script.trim()) {
            return;
        }
        this._parser_check(script);
        this._option_check();
    }
}

export default Lua;