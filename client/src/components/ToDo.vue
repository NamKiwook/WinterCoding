<template>
    <div class="container">
        <h2>Todo List</h2>
        <div class="input-group" style="margin-bottom:10px">
            <input type="text" class="form-control" placeholder="할일을 입력하세요" v-model="addedToDo.title">
            <span class="input-group-btn">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addModal">추가</button>
            </span>
        </div>
        <div class="accordion" id="ToDoList">
            <div class="card" v-for="(todo, index) in todos" v-bind:class="{ 'bg-info' : !todo.complete, 'bg-light' : todo.complete, 'bg-warning' : !todo.complete&&checkDeadline(todo.deadline) }">
                <div class="card-header" v-bind:id="'heading' + index">
                    <h5 class="mb-0" v-bind:class="{ 'text-white' : !todo.complete, 'text-dark' : todo.complete }">
                        {{index + 1}}:
                        <button class="btn btn-link" v-bind:class="{ 'text-white' : !todo.complete, 'text-dark' : todo.complete }" type="button" data-toggle="collapse" v-bind:data-target="'#collapse' + index" aria-expanded="true" v-bind:aria-controls="'collapse' + index">
                            {{todo.title}}
                        </button>
                    </h5>
                </div>
                <div v-bind:id="'collapse' + index" class="collapse" v-bind:aria-labelledby="'heading' + index" data-parent="#ToDoList">
                    <div class="card-body">
                        <p class="mb-0" v-bind:class="{ 'text-white' : !todo.complete, 'text-dark' : todo.complete }">{{todo.content}}</p>
                        <footer class="blockquote-footer" v-bind:class="{ 'text-white' : !todo.complete, 'text-dark' : todo.complete }" v-if="todo.deadline">Deadline: {{parseDate(todo.deadline)}}</footer>
                        <div class="text-right">
                            <div class="btn-group mt-3" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-danger" @click="deleteToDo(todo._id)">삭제</button>
                                <button type="button" class="btn btn-secondary" @click="completeToDo(todo._id)" v-if="!todo.complete">완료</button>
                                <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#modifyModal" @click="selectTodo(todo)" v-if="!todo.complete">수정</button>
                                <div class="btn-group" role="group">
                                    <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        우선순위
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                        <a class="dropdown-item" @click="modifyPriority(todo._id, true)">위로</a>
                                        <a class="dropdown-item"  @click="modifyPriority(todo._id, false)">아래로</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="alert alert-warning mb-0" role="alert" v-if="!todo.complete&&checkDeadline(todo.deadline)">
                    마감 기한이 지났습니다.
                </div>
            </div>
        </div>

        <!--생성 modal-->
        <div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addModalLabel">New ToDo</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="todoTitle" class="col-form-label">Title:</label>
                                <input type="text" class="form-control" id="todoTitle" v-model="addedToDo.title">
                            </div>
                            <div class="form-group">
                                <label for="todoContent" class="col-form-label">Content:</label>
                                <textarea class="form-control" id="todoContent" v-model="addedToDo.content"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="todoDeadline" class="col-form-label">(Option) Deadline:</label>
                                <input type="datetime-local" class="form-control" id="todoDeadline" v-model="addedToDo.deadline">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="addToDo">저장</button>
                    </div>
                </div>
            </div>
        </div>

        <!--수정 modal-->
        <div class="modal fade" id="modifyModal" tabindex="-1" role="dialog" aria-labelledby="modifyModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modifyModalLabel">Modify ToDo</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group mb-0">
                                <label for="modifyTitle" class="col-form-label">Title:</label>
                                <input type="text" class="form-control mb-2" id="modifyTitle" v-model="selectedToDo.title">
                                <div class="text-right">
                                    <button type="button" class="btn btn-primary" @click="modifyTitle(selectedToDo._id, selectedToDo.title)">변경</button>
                                </div>
                            </div>
                            <div class="form-group mb-0">
                                <label for="modifyContent" class="col-form-label">Content:</label>
                                <textarea class="form-control mb-2" id="modifyContent" v-model="selectedToDo.content"></textarea>
                                <div class="text-right">
                                    <button type="button" class="btn btn-primary" @click="modifyContent(selectedToDo._id, selectedToDo.content)">변경</button>
                                </div>
                            </div>
                            <div class="form-group mb-0">
                                <label for="modifyDeadline" class="col-form-label">Deadline:</label>
                                <input type="datetime-local" class="form-control  mb-2" id="modifyDeadline" v-model="selectedToDo.deadline">
                                <div class="text-right">
                                    <button type="submit" class="btn btn-primary" @click="modifyDeadline(selectedToDo._id, selectedToDo.deadline)">변경</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  export default {
    name: "to-do",
    data: () => ({
      todos: [],
      addedToDo: {title: "", content: "", deadline: ""},
      selectedToDo: {_id: "",title: "", content: "", deadline: ""}
    }),
    created() {
      this.loadToDo()
    },
    methods: {
      loadToDo() {
        this.$axios.get('/api/todo').then((res) => {
          this.todos = res.data
        }).catch((err) => {
          alert(err.response.data.errorMessage)
        })
      },
      addToDo() {
        this.$axios.post('/api/todo',this.addedToDo).then(() => {
          this.loadToDo()
          this.addedToDo = {title: "", content: "", deadline: ""}
        }).catch((err) => {
          alert(err.response.data.errorMessage)
        })
      },
      completeToDo(todoId) {
        this.$axios.put('/api/todo/complete', {todoId: todoId}).then(() => {
          this.loadToDo()
        }).catch((err) => {
          alert(err.response.data.errorMessage)
        })
      },
      modifyTitle(todoId, title){
        this.$axios.put('/api/todo/title', {todoId: todoId, title: title}).then(() => {
          this.loadToDo()
        }).catch((err) => {
          alert(err.response.data.errorMessage)
        })
      },
      modifyContent(todoId, content){
        this.$axios.put('/api/todo/content', {todoId: todoId, content: content}).then(() => {
          this.loadToDo()
        }).catch((err) => {
          alert(err.response.data.errorMessage)
        })
      },
      modifyPriority(todoId, up){
        this.$axios.put('/api/todo/priority', {todoId: todoId, up: up}).then(() => {
          this.loadToDo()
        }).catch((err) => {
          alert(err.response.data.errorMessage)
        })
      },
      modifyDeadline(todoId, deadline) {
        this.$axios.put('/api/todo/deadline', {todoId: todoId, deadline: deadline}).then(() => {
          this.loadToDo()
        }).catch((err) => {
          alert(err.response.data.errorMessage)
        })
      },
      deleteToDo(todoId) {
        this.$axios.delete('/api/todo',{data : {todoId: todoId}}).then(() => {
          this.loadToDo()
        }).catch((err) => {
          alert(err.response.data.errorMessage)
        })
      },
      checkDeadline(deadline) {
        if(!deadline) return false
        let currentTime = Date.now()
        if(new Date(deadline) - currentTime > 0) return false
        else return true
      },
      parseDate(date) {
        if(!date) return null
        let dateObject = new Date(date)
        return dateObject.getFullYear() + '년 ' + (Number(dateObject.getMonth()) + 1) + '월 ' + dateObject.getDate() + '일 ' + dateObject.getHours() + ':' + dateObject.getMinutes()
      },
      selectTodo(todo) {
        this.selectedToDo._id = todo._id
        this.selectedToDo.title = todo.title
        this.selectedToDo.content = todo.content
        if(todo.deadline) this.selectedToDo.deadline = todo.deadline.substr(0,16)
      }
    }
  }
</script>

<style scoped>
</style>