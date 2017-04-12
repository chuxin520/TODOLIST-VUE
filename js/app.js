(function (exports) {
	'use strict';
	// Your starting point. Enjoy the ride!
	//过滤器
	var filters = {
		all: function (todos) {
			return todos;
		},
		active: function (todos) {
			return todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		completed: function (todos) {
			return todos.filter(function (todo) {
				return todo.completed;
			});
		}
	};
	exports.app = new Vue({
		el: '.todoapp',
		data: {
			//todos: [{id: 1, label: '睡觉', completed: true}, {id: 2, label: '学习', completed: false}, {
			//	id: 3,
			//	label: '游泳',
			//	completed: false
			//}],
			todos: todoStorage.fetch(),
			todo: '',
			now: true,
			isEditting: -1,
			result: [],
			visibility: 'all',

		},
		computed: {
			//全部todolist
			filteredTodos: function () {
				return filters[this.visibility](this.todos);
			},
			remaining: function () {
				return filters.active(this.todos).length;
			},
			allDone: {
				get: function () {
					return this.remaining === 0;
				},
				set: function (value) {
					this.todos.forEach(function (todo) {
						todo.completed = value;
					});
				}
			}

		},
		methods: {
			//保证id不会重复
			getId: function () {
				var id = Math.random();
				for (var i = 0; i < this.todos.length; i++) {
					if (this.todos[i].id === id) {
						id = this.getId();
						break;
					}
				}
				return id;

			},
			//增加
			addtodo: function () {
				if (!this.todo) {
					return;
				}
				this.todos.push({id: this.getId(), label: this.todo, completed: false});
				this.todo = '';
			},
			//x----删除
			remove: function (id) {
				for (var i = 0; i < this.todos.length; i++) {
					if (this.todos[i].id === id) {
						this.todos.splice(i, 1);
						break;
					}
				}
			},
			//全选/全不选
			toggleAll: function () {
				for (var i = 0; i < this.todos.length; i++) {
					this.todos[i].completed = this.now;
				}
				;
				this.now = !this.now;
			},
			//清空完成的
			clear: function () {
				for (var i = 0; i < this.todos.length; i++) {
					if (this.todos[i].completed === false) {
						this.result.push(this.todos[i]);
					}
				}
				this.todos = this.result;
			},
			//编辑
			editItem: function (id) {
				this.isEditting = id;
			},
			save: function () {
				this.isEditting = -1;
			},
			// clearcompleted是否显示
			existCompleted: function () {
				// 该函数一定要有返回值
				for (var i = 0; i < this.todos.length; i++) {
					if (this.todos[i].completed) {
						return true;
					}
				}
				return false;
			},
			//是否显示复数
			pluralize: function (word) {
				return word + (this.todos.length > 1 ? 's' : '');
			},


		},
		// watch todos change for localStorage persistence
		watch: {
			todos: {
				deep: true,
				handler: todoStorage.save
			},

		}

	});

})(window);
