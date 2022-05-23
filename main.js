const IDENTIFIER = 101;
const ABSTRACTION = 102;
const APPLICATION = 103;

class Token { constructor(type, value) {
	this.type = type;
    this.value = value;
  }
}

class Node { constructor(type, left, right) {
	this.type = type;
	this.left = left;
	this.right = right; 
	this.highlight = false;
  }
}

function clone(object) {
	return JSON.parse(JSON.stringify(object));
}

function stringify_tree(node) {
	
	if (node == null) return null;
		
	let stack = [[node.type, node]];
	let str_list = [];
	
	while (stack.length > 0) {
		
		let cur = stack.pop();
		let type = cur[0];
		let object = cur[1];
		
		if (object != null && object.highlight) {
			stack.push(['HIGHLIGHT', null]);
			str_list.push('[[;#42f5b0;black]');
		}
	
		switch(type) {	
			default:
				break;
			case IDENTIFIER:
				str_list.push(object.left);
				break;
			case ABSTRACTION:
				str_list.push('(λ');
				stack.push(['CLOSE', null]);
				stack.push([object.right.type, object.right]);
				stack.push(['DOT', null]);
				stack.push([object.left.type, object.left]);
				break;
			case APPLICATION:
				stack.push([object.right.type, object.right]);
				stack.push([object.left.type, object.left]);
				break;
			case 'CLOSE':
				str_list.push('\)');
				break;
			case 'DOT':
				str_list.push('\.');
				break;
			case 'HIGHLIGHT':
				str_list.push(']');
				break;
		}
	}
	
	return str_list.join('');
}

function is_free_variable(term, parameter) {
	
	if ((term == null || parameter == null)) return false;
	if (parameter.type != IDENTIFIER) return false;
	
	let stack = [term];
	
	while (stack.length > 0) {
		let cur = stack.shift();
		if (cur.type == ABSTRACTION && cur.left.left == parameter.left) {
			continue;
		}	
		if (cur.type == IDENTIFIER && cur.left == parameter.left) {
			return true;
		}
		if (cur.left != null) {
			stack.push(cur.left);
		}
		if (cur.right != null) {
			stack.push(cur.right);
		}
	}
	
	return false;
}

function parser(command) {

	let token;
	let index = 0;
	let parser_list = [];
	let res = command.split("");
	
	while (index < res.length) {

		let element = res[index];
		
		switch(element) {
			default:
				break;
			case 'I': // I = (\x.x)
				var token_list = [ new Token('('.charCodeAt(0), '('), 
								   new Token('\\'.charCodeAt(0), '\\'),
								   new Token(IDENTIFIER, 'x'),
								   new Token('.'.charCodeAt(0), '.'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(')'.charCodeAt(0), ')')
								]
				parser_list = parser_list.concat(token_list);
				break;
			case 'S': // S = (\xyz.xz(yz))
				var token_list = [ new Token('('.charCodeAt(0), '('), 
								   new Token('\\'.charCodeAt(0), '\\'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(IDENTIFIER, 'y'),
								   new Token(IDENTIFIER, 'z'),
								   new Token('.'.charCodeAt(0), '.'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(IDENTIFIER, 'z'),
								   new Token('('.charCodeAt(0), '('),
								   new Token(IDENTIFIER, 'y'),
								   new Token(IDENTIFIER, 'z'),
								   new Token(')'.charCodeAt(0), ')'),
								   new Token(')'.charCodeAt(0), ')')
								]
				parser_list = parser_list.concat(token_list);
				break;
			case 'K': // K ------- (\x.\y.x)
				var token_list = [ new Token('('.charCodeAt(0), '('), 
								   new Token('\\'.charCodeAt(0), '\\'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(IDENTIFIER, 'y'),
								   new Token('.'.charCodeAt(0), '.'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(')'.charCodeAt(0), ')')
					]
				parser_list = parser_list.concat(token_list);
				break;
			case 'B':
				var token_list = [ new Token('('.charCodeAt(0), '('), 
								   new Token('\\'.charCodeAt(0), '\\'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(IDENTIFIER, 'y'),
								   new Token(IDENTIFIER, 'z'),
								   new Token('.'.charCodeAt(0), '.'),
								   new Token(IDENTIFIER, 'x'),
								   new Token('('.charCodeAt(0), '('),
								   new Token(IDENTIFIER, 'y'),
								   new Token(IDENTIFIER, 'z'),  
								   new Token(')'.charCodeAt(0), ')'),
								   new Token(')'.charCodeAt(0), ')')
					]
				parser_list = parser_list.concat(token_list);
				break;
			case 'C':
				var token_list = [ new Token('('.charCodeAt(0), '('), 
								   new Token('\\'.charCodeAt(0), '\\'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(IDENTIFIER, 'y'),
								   new Token(IDENTIFIER, 'z'),
								   new Token('.'.charCodeAt(0), '.'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(IDENTIFIER, 'z'),
								   new Token(IDENTIFIER, 'y'),  
								   new Token(')'.charCodeAt(0), ')')
					]
				parser_list = parser_list.concat(token_list);
				break;
			case 'W':
				var token_list = [ new Token('('.charCodeAt(0), '('), 
								   new Token('\\'.charCodeAt(0), '\\'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(IDENTIFIER, 'y'),
								   new Token('.'.charCodeAt(0), '.'),
								   new Token(IDENTIFIER, 'x'),
								   new Token(IDENTIFIER, 'y'),
								   new Token(IDENTIFIER, 'y'),  
								   new Token(')'.charCodeAt(0), ')')
					]
				parser_list = parser_list.concat(token_list);
				break;
			case 'M':
				var token_list = [ new Token('('.charCodeAt(0), '('), 
								   new Token('\\'.charCodeAt(0), '\\'),
								   new Token(IDENTIFIER, 'f'),
								   new Token('.'.charCodeAt(0), '.'),
								   new Token(IDENTIFIER, 'f'),
								   new Token(IDENTIFIER, 'f'), 
								   new Token(')'.charCodeAt(0), ')')
				]
				parser_list = parser_list.concat(token_list);
				break;
			case element.match(/[a-zA-Z]/)?.input:
				token = new Token(IDENTIFIER, element);
				parser_list.push(token); 
				break;
			case 'λ':
			case '\\':
				token = new Token('\\'.charCodeAt(0), '\\');
				parser_list.push(token); 
				break;
			case '.': 
				token = new Token('.'.charCodeAt(0), '.');
				parser_list.push(token); 
				break;
			case '(':
				token = new Token('('.charCodeAt(0), '(');
				parser_list.push(token); 
				break;
			case ')': 
				token = new Token(')'.charCodeAt(0), ')');
				parser_list.push(token); 
				break;
		}
	
		index++;
	}
	
	return parser_list;
}

function convert_to_brujin(node, context={}) {
	
	if (node == null) {
		return;
	}
	
	switch (node.type) {
		
		case IDENTIFIER:
			if (node.left in context) {
				node.left = Number(context[node.left]);
			}
			break;
			
			
		case ABSTRACTION:
			let new_parameter = node.left.left;
			for (const [key, value] of Object.entries(context)) {
				context[key] += 1;
			}
			context[node.left.left] = 0;
			node.right = convert_to_brujin(node.right, clone(context));
			node.left.left = '';
			break;
		
		case APPLICATION:
			node.left = convert_to_brujin(node.left, clone(context));
			node.right = convert_to_brujin(node.right, clone(context));
			break;
			
	}
	
	return node;
}

var FOO = (function() {
	
	var global_list;
	var bound_integer;
	var original_AST;
	
	function skip(type) {
		if (next(type)) {
			global_list.shift();
			return true;
		}
		return false;
	}
	
	function match(type) {
		if (next(type)) {
			global_list.shift();
			return;
		}
		throw "Something went badly wrong!";
	}
	
	function next(type) {
		if (global_list == null || global_list.length == 0) return null;
		return global_list[0].type == type;	
	}

	function expression() {
		if (skip('\\'.charCodeAt(0))) {
			if (!next(IDENTIFIER)) throw 'Something went badly wrong!';
			let parameter = new Node(IDENTIFIER, global_list.shift().value, null); // need to include multiple
			if (!skip('.'.charCodeAt(0))) {
				if (next(IDENTIFIER)) {
					global_list.unshift(new Token('\\'.charCodeAt(0), '\\'));	
				} else {
					throw 'Something went badly wrong!';
				}
			}
			let expr = expression();
			return new Node(ABSTRACTION, parameter, expr);
		}
		return application();
	}
	
	function application() {
		let lhs = atom();
		while (true) {
			let rhs = atom();
			if (rhs == null || rhs == undefined) {
				return lhs;
			}
			lhs = new Node(APPLICATION, lhs, rhs); 
		}
	}
	
	function atom() {
		if (skip('('.charCodeAt(0))) {
			let expr = expression();
			match(')'.charCodeAt(0));
			return expr;
		}
		else if (next(IDENTIFIER)) {
			return new Node(IDENTIFIER, global_list.shift().value, null);
		}
		return null;
	}
	
	function substitute(expr_body, parameter, substitute_expr) {
		
		let term = expr_body.right;
		
		if (term == null || parameter == null || substitute_expr == null) return null;
		
		let prev = [];
		let stack = [];
		
		stack.push(['RETURN', null, null, null]);
		stack.push([term.type, term, parameter, substitute_expr]);
		
		while (stack.length > 0) {
			
			let cur = stack.pop();
			
			let type = cur[0];
			let cur_term = cur[1];
			let cur_parameter = cur[2];
			let cur_expression = cur[3];
			
			switch (type) {
				
				case IDENTIFIER: // 101
					if (cur_term.left == cur_parameter.left) { // x[x := N] = N
						stack.push(['PREV', cur_expression, null, null]);	
					} 
					else { // y[x := N] = y
						stack.push(['PREV', cur_term, null, null]);	
					}
					break;
					
				case APPLICATION: // 103
					stack.push(['PREV', cur_term, null, null]);
					stack.push(['VARIABLE_R', cur_term, null, null]);
					stack.push([cur_term.right.type, cur_term.right, cur_parameter, cur_expression]);
					stack.push(['VARIABLE_L', cur_term, null, null]);
					stack.push([cur_term.left.type, cur_term.left, cur_parameter, cur_expression]);
					break;
				
				case ABSTRACTION: // 102
					if (cur_term.left.left == cur_parameter.left) {
						stack.push(['PREV', cur_term, null, null]);	
					} 
					else if (!is_free_variable(cur_expression, cur_term.left)) {
						stack.push(['PREV', cur_term, null, null]);						
						stack.push(['VARIABLE_R', cur_term, null, null]);
						stack.push([cur_term.right.type, cur_term.right, cur_parameter, cur_expression]);
					} 
					else {
						stack.push(['RETURN_ALPHA', null, null, null]);
						stack.push(['PREV', expr_body, null, null]);						
						stack.push(['UPDATE', cur_term, cur_parameter, cur_expression]);
						stack.push(['VARIABLE_R', cur_term, null, null]);
						stack.push([cur_term.right.type, cur_term.right, cur_term.left, new Node(IDENTIFIER, bound_integer.toString(), null)]);
					}
					break;
				case 'VARIABLE_L':
					cur_term.left = prev.pop();
					break;
					
				case 'VARIABLE_R':
					cur_term.right = prev.pop();
					break;
					
				case 'RETURN':
					terminal_print('BETA REDUCTION:');
					return prev.pop();
					break;
					
				case 'RETURN_ALPHA':
					terminal_print('ALPHA CONVERSION:');
					return new Node(APPLICATION, prev.pop(), substitute_expr);
					break;
				
				case 'PREV':
					prev.push(cur_term);
					break;
					
				case 'UPDATE':
					cur_term.left.left = bound_integer.toString();
					bound_integer = bound_integer + 1;
					break;
				
			}
			
		}
		
	}
	
	function s_direction(directions, term) {
		
		let return_obj = clone(original_AST);
		let return_root = return_obj;
		
		let highlight_obj = clone(original_AST);
		let highlight_root = highlight_obj;
		
		if (directions.length == 0) {
			highlight_obj.left.left.highlight = true;
			highlight_obj.right.highlight = true;
			return [highlight_obj, term];
		}
		
		let final_dir = directions.pop();
		
		for (dir in directions) {
			if (directions[dir] === 'L') {
				return_obj = return_obj.left;
				highlight_obj = highlight_obj.left;
			}				
			else if (directions[dir] === 'R') {
				return_obj = return_obj.right;
				highlight_obj = highlight_obj.right;
			}
		}
		
		if (final_dir === 'L') {
			highlight_obj.left.left.left.highlight = true;
			highlight_obj.left.right.highlight = true;
			return_obj.left = term;
		}
		else if (final_dir === 'R') {
			highlight_obj.right.left.left.highlight = true;
			highlight_obj.right.right.highlight = true;
			return_obj.right = term;
		}
		
		return [highlight_root, return_root];
	}
	
	function interpret(term) {
		
		if (term == null) return null;

		let prev = [];
		let stack = [];
		let prev_direction = [];
		
		stack.push(['RETURN', null]);
		stack.push([term.type, term, []]);
		
		while (stack.length > 0) {
			
			let cur = stack.pop();
			
			let type = cur[0];
			let object = cur[1];
			let direction = cur[2];
			
			switch (type) {
				
				case IDENTIFIER:
					break;
				
				case ABSTRACTION:
					stack.push(['VARIABLE_R', object, null]);
					stack.push([object.right.type, object.right, direction.concat(['R'])]);
					break;
					
				case APPLICATION:
					stack.push(['COMPUTE', null, direction]);
					stack.push([object.right.type, clone(object.right), direction.concat(['R'])]);
					stack.push([object.left.type, clone(object.left), direction.concat(['L'])]);
					break;
				
				case 'VARIABLE_R':
					object.right = prev.pop();
					break;
					
				case 'COMPUTE':
					let result = null;
					let right_redex = prev.pop();
					let left_redex = prev.pop();
					prev.pop();
					if (left_redex.type == ABSTRACTION) {
						result = substitute(left_redex, left_redex.left, right_redex);
						stack.push([result.type, result, prev_direction.concat(direction)]);
						let [temp1, temp2] = s_direction(direction, result);
						terminal_print(stringify_tree(temp1) + ' ---> ' + stringify_tree(temp2));
						original_AST = temp2;
					} 
					else {				
						result = new Node(APPLICATION, left_redex, right_redex);
						prev.push(result);
					}				 
					break;
					
				case 'RETURN':
					return prev.pop();
				
			}	
			
			if (type == IDENTIFIER || type == ABSTRACTION || type == APPLICATION) prev.push(object);	
		}	
		return prev.pop();
	}
	
    return {
        interpret: function(command) {
            bound_integer = 0;
			global_list = parser(command);
			let AST = expression();
			if (AST == null) throw 'Something went badly wrong!';
			original_AST = clone(AST);
			let line = interpret(AST);
			return line;
		},
		alpha_equivalence: function(command1, command2) {
			let term1 = FOO.interpret(command1);
			let term2 = FOO.interpret(command2);
			term1 = convert_to_brujin(term1);
			term2 = convert_to_brujin(term2);
			if (term1 == null || term2 == null) {
				return false;
			}
			return stringify_tree(term1) === stringify_tree(term2);
		},
		convert: function(command) {
            bound_integer = 0;
			global_list = parser(command);
			let AST = expression();
			if (AST == null) throw 'Something went badly wrong!';
			original_AST = clone(AST);
			let line = convert_to_brujin(interpret(AST));
			return line;		
		}
	}
})();

const interpret = function interpret_function(command) {
					return FOO.interpret(command); 
				  }

const alpha_equivalence = function alpha_equivalence_function(command1, command2) {
							return FOO.alpha_equivalence(command1, command2);
						  }

const stringify = function stringify(AST) {
					return stringify_tree(AST);
				  }
					   
function terminal_print(string) {
	return;
}