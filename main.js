/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
function check(name) {
  return {
    name,
    value: false,
  };
}

function todo(title, description, dueDate, priority, notes, checklist) {
  let obj = {
    title,
    description,
    dueDate,
    priority,
    notes,
    _checklist: [],
    completed: false,
    get checklist() {
      return this._checklist;
    },
    set checklist(arr) {
      for (let i = 0; i < arr.length; i++) {
        this._checklist.push(check(arr[i]));
      }
    },
  };
  obj.checklist = checklist;
  return obj;
}

function project(name, description) {
  return {
    name,
    description,
    _list: [],
    get getList() {
      return this._list;
    },
    addToList(title, description, dueDate, priority, notes, checklist) {
      let obj = todo(
        title,
        description ? description : "",
        dueDate,
        priority ? priority : 5,
        notes ? notes : "",
        checklist ? checklist : []
      );
      this._list.push(obj);
    },
  };
}

let projects = (function projects() {
  return {
    _list: [],
    get getList() {
      return this._list;
    },
    addToList(name, description) {
      if (this._default == -1) {
        this._default = 0;
      }
      let obj = project(name, description);
      this._list.push(obj);
    },

    _default: -1,
    get default() {
      return this._default;
    },

    set default(value) {
      this._default = Number(value);
    },

    getFromList(index) {
      return this._list[index];
    },
  };
})();

let dom = (function () {
  function _init() {
    //anchors to be implemented
    let projectAnchor = document.querySelector(".projects");
    projectAnchor.addEventListener("click", (e) => {
      e.preventDefault();
      showMyProjects();
    });
  }
  _init();
  let _content = document.querySelector(".content");
  let _buttons = _content.firstElementChild;
  let _wrapper = _content.lastElementChild;
  let _createProjectButton = document.createElement("button");
  _createProjectButton.innerText = "Create";
  _createProjectButton.addEventListener("click", _creatingProject);
  let _createtodoButton = document.createElement("button");
  _createtodoButton.addEventListener("click", creatingtodo);
  _createtodoButton.innerText = "Create";

  function creatingtodo() {
    _wrapper.innerHTML = "";
    let form = document.createElement("form");
    form.classList.add("form-wrapper");

    let title = document.createElement("input");
    title.id = "title";
    title.required = true;
    title.placeholder = "Title *";

    let description = document.createElement("textarea");
    description.id = "description";
    description.placeholder = "Description";

    let duedate = document.createElement("input");
    duedate.type = "date";
    duedate.placeholder = "Duedate";
    duedate.id = "duedate";

    let priority = document.createElement("input");
    priority.type = "number";
    priority.value = 5;
    priority.max = "5";
    priority.min = "0";
    priority.id = "priorty";
    priority.placeholder = "Priorty";

    let notes = document.createElement("input");
    notes.id = "notes";
    notes.placeholder = "Notes";

    let div = document.createElement("div");
    let p = document.createElement("p");
    p.innerText = "Check list";
    div.appendChild(p);
    let button = document.createElement("button");
    button.innerText = "add a checkBox";
    button.type = "button";
    div.appendChild(button);
    button.addEventListener("click", addcheck);
    let index = 0;
    let checklist = [];
    form.appendChild(title);
    form.appendChild(description);
    form.appendChild(duedate);
    form.appendChild(priority);
    form.appendChild(notes);
    form.appendChild(div);

    function addcheck(e) {
      let cont = document.createElement("div");
      let removebutton = document.createElement("button");
      removebutton.type = "button";
      removebutton.setAttribute("data-rem", index);
      removebutton.addEventListener("click", removecheck);
      removebutton.innerText = "temp";
      let check = document.createElement("input");
      check.id = `check-box${index++}`;
      check.placeholder = "add a CheckBox";
      checklist.push(check);
      cont.appendChild(check);
      cont.appendChild(removebutton);
      div.appendChild(cont);

      function removecheck(e) {
        let index = e.target.getAttribute("data-rem");
        checklist.splice(index, 1);
        cont.remove(document.querySelector(`check-box${index}`));
        cont.remove(e.target);
      }
    }

    let submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.addEventListener("click", submit);
    form.appendChild(submitButton);
    function submit(e) {
      let titleText = title.value;
      let descriptionText = description.value;
      let duedatetext = duedate.value;
      let prioritytext = priority.value;
      let notestext = notes.value;
      let checklistvalue = [];
      for (let i = 0; i < checklist.length; i++) {
        checklistvalue.push(checklist[i].value);
      }
      console.log(checklistvalue);
      let num = _createtodoButton.getAttribute("data-project");
      projects.getList[num].addToList(
        titleText,
        descriptionText,
        duedatetext,
        prioritytext,
        notestext,
        checklistvalue,
      );
      e.preventDefault();
      showtodos(num, true);
    }
    _wrapper.appendChild(form);
  }
  function _creatingProject() {
    _wrapper.innerHTML = "";
    let form = document.createElement("form");
    form.classList.add("form-wrapper");
    let name = document.createElement("input");
    name.id = "name";
    name.required = true;
    name.placeholder = "Name of The Project*";
    let description = document.createElement("textarea");
    description.id = "description";
    description.placeholder = "Description";
    form.appendChild(name);
    form.appendChild(description);
    let button = document.createElement("button");
    button.innerText = "Submit";
    button.addEventListener("click", submit);
    form.appendChild(button);
    function submit(e) {
      let nameText = name.value;
      let descriptionText = description.value;

      if (form.checkValidity()) {
        projects.addToList(nameText, descriptionText);
        e.preventDefault();
        showMyProjects();
      }
    }
    _wrapper.appendChild(form);
  }
  let showMyProjects = function () {
    _buttons.innerHTML = "";
    _wrapper.innerHTML = "";
    _buttons.appendChild(_createProjectButton);
    for (let i = 0; i < projects.getList.length; i++) {
      let project = document.createElement("div");
      project.classList.add("project");
      project.setAttribute("data-key", i);
      let p_wrapper = document.createElement("div");
      let name = document.createElement("p");
      let description = document.createElement("p");
      let defaultBox = document.createElement("input");
      p_wrapper.classList.add("p-wrapper");
      defaultBox.type = "checkbox";
      defaultBox.id = `default${i}`;
      if (i == projects.default) {
        defaultBox.checked = true;
        defaultBox.disabled = true;
      }
      defaultBox.addEventListener("change", _changeDefault);
      let defaultBoxLabel = document.createElement("label");
      defaultBoxLabel.innerText = "Default";
      defaultBoxLabel.htmlFor = `default${i}`;
      let div = document.createElement("div");
      div.appendChild(defaultBoxLabel);
      div.appendChild(defaultBox);
      div.classList.add("checkbox-wrapper");
      name.innerText = projects.getList[i].name;
      description.innerText = projects.getList[i].description;
      p_wrapper.appendChild(name);
      p_wrapper.appendChild(description);
      project.appendChild(p_wrapper);
      project.appendChild(div);
      _wrapper.appendChild(project);
      p_wrapper.addEventListener("click", showtodos);
    }

    function _changeDefault(e) {
      let index = e.target.id.replace("default", "");
      let check = document.querySelector(`#default${projects.default}`);
      check.disabled = false;
      check.checked = false;
      projects.default = index;
      e.target.disabled = true;
      e.target.checked = true;
    }
  };
  function showtodos(e) {
    let num;
    if (arguments.length == 2) {
      num = e;
    } else {
      num = this.parentElement.getAttribute("data-key");
      console.log(num);
    }
    _wrapper.innerHTML = "";
    _buttons.innerHTML = "";
    _buttons.appendChild(_createtodoButton);
    _createtodoButton.setAttribute("data-project", num);
    let temp = projects.getFromList(num);
    let list = temp.getList;
    for (let i = 0; i < list.length; i++) {
      showMinimumtoDo(list[i],i);
    }
  }
  function showMinimumtoDo(obj,index){
    let todo = document.createElement("div");
    todo.classList.add("todo");
    todo.setAttribute("data-key",index)
    if (arguments.length == 3) {
      let projectname = document.createElement("div");
      projectname.innerText = arguments[2];
      todo.appendChild(projectname);
    }
    let title = document.createElement("p");
    let dueDate = document.createElement("p");

    let div = document.createElement("div");
    let check = document.createElement("input");
    check.type = "checkbox";
    check.id = "complete";
    let checklabel = document.createElement("label");
    checklabel.htmlFor = "complete";
    checklabel.innerText = "Completed";
    div.appendChild(check);
    div.appendChild(checklabel);

    title.innerText = obj.title;
    dueDate.innerText = obj.dueDate;

    let detailsButton = document.createElement("button")
    detailsButton.innerText = "Details"
    detailsButton.addEventListener("click",details)
    todo.appendChild(div);
    todo.appendChild(title);
    todo.appendChild(dueDate);
    todo.appendChild(detailsButton);
    _wrapper.appendChild(todo);

    function details(e){
      let indextodo = e.target.parentElement.getAttribute("data-key");
      let indexproject = _createtodoButton.getAttribute("data-project");
      showtoDo((((projects.getList)[indexproject]).getList)[indextodo]);
    }
  }
  function showtoDo(obj) {
    _wrapper.innerHTML = "";
    let todo = document.createElement("div");
    todo.classList.add("todo-wrapper");
    if (arguments.length == 2) {
      let projectname = document.createElement("div");
      projectname.innerText = arguments[2];
      todo.appendChild(projectname);
    }
    let title = document.createElement("p");
    let dueDate = document.createElement("p");
    let priority = document.createElement("p");
    let notes = document.createElement("p");
    let checklist = document.createElement("div");
    for (let i = 0; i < obj.checklist.length; i++) {
      let div = document.createElement("div");
      let check = document.createElement("input");
      check.type = "checkbox";
      check.checked = obj.checklist[i].value;
      check.id = `check${i}`;
      let checklabel = document.createElement("label");
      checklabel.htmlFor = `check${i}`;
      checklabel.innerText = `${obj.checklist[i].name}`;
      div.appendChild(check);
      div.appendChild(checklabel);
      checklist.appendChild(div);
    }
    let div = document.createElement("div");
    let check = document.createElement("input");
    check.type = "checkbox";
    check.id = "complete";
    let checklabel = document.createElement("label");
    checklabel.htmlFor = "complete";
    checklabel.innerText = "Completed";
    div.appendChild(check);
    div.appendChild(checklabel);

    title.innerText = obj.title;
    dueDate.innerText = obj.dueDate;
    priority.innerText = obj.priority;
    notes.innerText = obj.notes;
    todo.appendChild(div);
    todo.appendChild(title);
    todo.appendChild(dueDate);
    todo.appendChild(priority);
    todo.appendChild(notes);
    todo.appendChild(checklist);
    _wrapper.appendChild(todo);
  }

  return {
    showMyProjects,
  };
})();

dom.showMyProjects();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMEJBQTBCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLEVBQUU7QUFDM0I7QUFDQSxtQ0FBbUMsRUFBRTtBQUNyQyxnQ0FBZ0Msc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVtcGxhdGUwMDEvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY2hlY2sobmFtZSkge1xuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgdmFsdWU6IGZhbHNlLFxuICB9O1xufVxuXG5mdW5jdGlvbiB0b2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIG5vdGVzLCBjaGVja2xpc3QpIHtcbiAgbGV0IG9iaiA9IHtcbiAgICB0aXRsZSxcbiAgICBkZXNjcmlwdGlvbixcbiAgICBkdWVEYXRlLFxuICAgIHByaW9yaXR5LFxuICAgIG5vdGVzLFxuICAgIF9jaGVja2xpc3Q6IFtdLFxuICAgIGNvbXBsZXRlZDogZmFsc2UsXG4gICAgZ2V0IGNoZWNrbGlzdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jaGVja2xpc3Q7XG4gICAgfSxcbiAgICBzZXQgY2hlY2tsaXN0KGFycikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5fY2hlY2tsaXN0LnB1c2goY2hlY2soYXJyW2ldKSk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbiAgb2JqLmNoZWNrbGlzdCA9IGNoZWNrbGlzdDtcbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gcHJvamVjdChuYW1lLCBkZXNjcmlwdGlvbikge1xuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgX2xpc3Q6IFtdLFxuICAgIGdldCBnZXRMaXN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG4gICAgfSxcbiAgICBhZGRUb0xpc3QodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgbm90ZXMsIGNoZWNrbGlzdCkge1xuICAgICAgbGV0IG9iaiA9IHRvZG8oXG4gICAgICAgIHRpdGxlLFxuICAgICAgICBkZXNjcmlwdGlvbiA/IGRlc2NyaXB0aW9uIDogXCJcIixcbiAgICAgICAgZHVlRGF0ZSxcbiAgICAgICAgcHJpb3JpdHkgPyBwcmlvcml0eSA6IDUsXG4gICAgICAgIG5vdGVzID8gbm90ZXMgOiBcIlwiLFxuICAgICAgICBjaGVja2xpc3QgPyBjaGVja2xpc3QgOiBbXVxuICAgICAgKTtcbiAgICAgIHRoaXMuX2xpc3QucHVzaChvYmopO1xuICAgIH0sXG4gIH07XG59XG5cbmxldCBwcm9qZWN0cyA9IChmdW5jdGlvbiBwcm9qZWN0cygpIHtcbiAgcmV0dXJuIHtcbiAgICBfbGlzdDogW10sXG4gICAgZ2V0IGdldExpc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9LFxuICAgIGFkZFRvTGlzdChuYW1lLCBkZXNjcmlwdGlvbikge1xuICAgICAgaWYgKHRoaXMuX2RlZmF1bHQgPT0gLTEpIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdCA9IDA7XG4gICAgICB9XG4gICAgICBsZXQgb2JqID0gcHJvamVjdChuYW1lLCBkZXNjcmlwdGlvbik7XG4gICAgICB0aGlzLl9saXN0LnB1c2gob2JqKTtcbiAgICB9LFxuXG4gICAgX2RlZmF1bHQ6IC0xLFxuICAgIGdldCBkZWZhdWx0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHQ7XG4gICAgfSxcblxuICAgIHNldCBkZWZhdWx0KHZhbHVlKSB7XG4gICAgICB0aGlzLl9kZWZhdWx0ID0gTnVtYmVyKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgZ2V0RnJvbUxpc3QoaW5kZXgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9saXN0W2luZGV4XTtcbiAgICB9LFxuICB9O1xufSkoKTtcblxubGV0IGRvbSA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIF9pbml0KCkge1xuICAgIC8vYW5jaG9ycyB0byBiZSBpbXBsZW1lbnRlZFxuICAgIGxldCBwcm9qZWN0QW5jaG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcm9qZWN0c1wiKTtcbiAgICBwcm9qZWN0QW5jaG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2hvd015UHJvamVjdHMoKTtcbiAgICB9KTtcbiAgfVxuICBfaW5pdCgpO1xuICBsZXQgX2NvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnRcIik7XG4gIGxldCBfYnV0dG9ucyA9IF9jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICBsZXQgX3dyYXBwZXIgPSBfY29udGVudC5sYXN0RWxlbWVudENoaWxkO1xuICBsZXQgX2NyZWF0ZVByb2plY3RCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBfY3JlYXRlUHJvamVjdEJ1dHRvbi5pbm5lclRleHQgPSBcIkNyZWF0ZVwiO1xuICBfY3JlYXRlUHJvamVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2NyZWF0aW5nUHJvamVjdCk7XG4gIGxldCBfY3JlYXRldG9kb0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIF9jcmVhdGV0b2RvQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjcmVhdGluZ3RvZG8pO1xuICBfY3JlYXRldG9kb0J1dHRvbi5pbm5lclRleHQgPSBcIkNyZWF0ZVwiO1xuXG4gIGZ1bmN0aW9uIGNyZWF0aW5ndG9kbygpIHtcbiAgICBfd3JhcHBlci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGxldCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgZm9ybS5jbGFzc0xpc3QuYWRkKFwiZm9ybS13cmFwcGVyXCIpO1xuXG4gICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIHRpdGxlLmlkID0gXCJ0aXRsZVwiO1xuICAgIHRpdGxlLnJlcXVpcmVkID0gdHJ1ZTtcbiAgICB0aXRsZS5wbGFjZWhvbGRlciA9IFwiVGl0bGUgKlwiO1xuXG4gICAgbGV0IGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuICAgIGRlc2NyaXB0aW9uLmlkID0gXCJkZXNjcmlwdGlvblwiO1xuICAgIGRlc2NyaXB0aW9uLnBsYWNlaG9sZGVyID0gXCJEZXNjcmlwdGlvblwiO1xuXG4gICAgbGV0IGR1ZWRhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgZHVlZGF0ZS50eXBlID0gXCJkYXRlXCI7XG4gICAgZHVlZGF0ZS5wbGFjZWhvbGRlciA9IFwiRHVlZGF0ZVwiO1xuICAgIGR1ZWRhdGUuaWQgPSBcImR1ZWRhdGVcIjtcblxuICAgIGxldCBwcmlvcml0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBwcmlvcml0eS50eXBlID0gXCJudW1iZXJcIjtcbiAgICBwcmlvcml0eS52YWx1ZSA9IDU7XG4gICAgcHJpb3JpdHkubWF4ID0gXCI1XCI7XG4gICAgcHJpb3JpdHkubWluID0gXCIwXCI7XG4gICAgcHJpb3JpdHkuaWQgPSBcInByaW9ydHlcIjtcbiAgICBwcmlvcml0eS5wbGFjZWhvbGRlciA9IFwiUHJpb3J0eVwiO1xuXG4gICAgbGV0IG5vdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIG5vdGVzLmlkID0gXCJub3Rlc1wiO1xuICAgIG5vdGVzLnBsYWNlaG9sZGVyID0gXCJOb3Rlc1wiO1xuXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBwLmlubmVyVGV4dCA9IFwiQ2hlY2sgbGlzdFwiO1xuICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBidXR0b24uaW5uZXJUZXh0ID0gXCJhZGQgYSBjaGVja0JveFwiO1xuICAgIGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFkZGNoZWNrKTtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGxldCBjaGVja2xpc3QgPSBbXTtcbiAgICBmb3JtLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICBmb3JtLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcbiAgICBmb3JtLmFwcGVuZENoaWxkKGR1ZWRhdGUpO1xuICAgIGZvcm0uYXBwZW5kQ2hpbGQocHJpb3JpdHkpO1xuICAgIGZvcm0uYXBwZW5kQ2hpbGQobm90ZXMpO1xuICAgIGZvcm0uYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIGZ1bmN0aW9uIGFkZGNoZWNrKGUpIHtcbiAgICAgIGxldCBjb250ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGxldCByZW1vdmVidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgcmVtb3ZlYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgcmVtb3ZlYnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtcmVtXCIsIGluZGV4KTtcbiAgICAgIHJlbW92ZWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVtb3ZlY2hlY2spO1xuICAgICAgcmVtb3ZlYnV0dG9uLmlubmVyVGV4dCA9IFwidGVtcFwiO1xuICAgICAgbGV0IGNoZWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgY2hlY2suaWQgPSBgY2hlY2stYm94JHtpbmRleCsrfWA7XG4gICAgICBjaGVjay5wbGFjZWhvbGRlciA9IFwiYWRkIGEgQ2hlY2tCb3hcIjtcbiAgICAgIGNoZWNrbGlzdC5wdXNoKGNoZWNrKTtcbiAgICAgIGNvbnQuYXBwZW5kQ2hpbGQoY2hlY2spO1xuICAgICAgY29udC5hcHBlbmRDaGlsZChyZW1vdmVidXR0b24pO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGNvbnQpO1xuXG4gICAgICBmdW5jdGlvbiByZW1vdmVjaGVjayhlKSB7XG4gICAgICAgIGxldCBpbmRleCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtcmVtXCIpO1xuICAgICAgICBjaGVja2xpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgY29udC5yZW1vdmUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgY2hlY2stYm94JHtpbmRleH1gKSk7XG4gICAgICAgIGNvbnQucmVtb3ZlKGUudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBzdWJtaXRCdXR0b24uaW5uZXJUZXh0ID0gXCJTdWJtaXRcIjtcbiAgICBzdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN1Ym1pdCk7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChzdWJtaXRCdXR0b24pO1xuICAgIGZ1bmN0aW9uIHN1Ym1pdChlKSB7XG4gICAgICBsZXQgdGl0bGVUZXh0ID0gdGl0bGUudmFsdWU7XG4gICAgICBsZXQgZGVzY3JpcHRpb25UZXh0ID0gZGVzY3JpcHRpb24udmFsdWU7XG4gICAgICBsZXQgZHVlZGF0ZXRleHQgPSBkdWVkYXRlLnZhbHVlO1xuICAgICAgbGV0IHByaW9yaXR5dGV4dCA9IHByaW9yaXR5LnZhbHVlO1xuICAgICAgbGV0IG5vdGVzdGV4dCA9IG5vdGVzLnZhbHVlO1xuICAgICAgbGV0IGNoZWNrbGlzdHZhbHVlID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoZWNrbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjaGVja2xpc3R2YWx1ZS5wdXNoKGNoZWNrbGlzdFtpXS52YWx1ZSk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhjaGVja2xpc3R2YWx1ZSk7XG4gICAgICBsZXQgbnVtID0gX2NyZWF0ZXRvZG9CdXR0b24uZ2V0QXR0cmlidXRlKFwiZGF0YS1wcm9qZWN0XCIpO1xuICAgICAgcHJvamVjdHMuZ2V0TGlzdFtudW1dLmFkZFRvTGlzdChcbiAgICAgICAgdGl0bGVUZXh0LFxuICAgICAgICBkZXNjcmlwdGlvblRleHQsXG4gICAgICAgIGR1ZWRhdGV0ZXh0LFxuICAgICAgICBwcmlvcml0eXRleHQsXG4gICAgICAgIG5vdGVzdGV4dCxcbiAgICAgICAgY2hlY2tsaXN0dmFsdWUsXG4gICAgICApO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2hvd3RvZG9zKG51bSwgdHJ1ZSk7XG4gICAgfVxuICAgIF93cmFwcGVyLmFwcGVuZENoaWxkKGZvcm0pO1xuICB9XG4gIGZ1bmN0aW9uIF9jcmVhdGluZ1Byb2plY3QoKSB7XG4gICAgX3dyYXBwZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICBsZXQgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xuICAgIGZvcm0uY2xhc3NMaXN0LmFkZChcImZvcm0td3JhcHBlclwiKTtcbiAgICBsZXQgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBuYW1lLmlkID0gXCJuYW1lXCI7XG4gICAgbmFtZS5yZXF1aXJlZCA9IHRydWU7XG4gICAgbmFtZS5wbGFjZWhvbGRlciA9IFwiTmFtZSBvZiBUaGUgUHJvamVjdCpcIjtcbiAgICBsZXQgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgZGVzY3JpcHRpb24uaWQgPSBcImRlc2NyaXB0aW9uXCI7XG4gICAgZGVzY3JpcHRpb24ucGxhY2Vob2xkZXIgPSBcIkRlc2NyaXB0aW9uXCI7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChuYW1lKTtcbiAgICBmb3JtLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBidXR0b24uaW5uZXJUZXh0ID0gXCJTdWJtaXRcIjtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN1Ym1pdCk7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIGZ1bmN0aW9uIHN1Ym1pdChlKSB7XG4gICAgICBsZXQgbmFtZVRleHQgPSBuYW1lLnZhbHVlO1xuICAgICAgbGV0IGRlc2NyaXB0aW9uVGV4dCA9IGRlc2NyaXB0aW9uLnZhbHVlO1xuXG4gICAgICBpZiAoZm9ybS5jaGVja1ZhbGlkaXR5KCkpIHtcbiAgICAgICAgcHJvamVjdHMuYWRkVG9MaXN0KG5hbWVUZXh0LCBkZXNjcmlwdGlvblRleHQpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNob3dNeVByb2plY3RzKCk7XG4gICAgICB9XG4gICAgfVxuICAgIF93cmFwcGVyLmFwcGVuZENoaWxkKGZvcm0pO1xuICB9XG4gIGxldCBzaG93TXlQcm9qZWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBfYnV0dG9ucy5pbm5lckhUTUwgPSBcIlwiO1xuICAgIF93cmFwcGVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgX2J1dHRvbnMuYXBwZW5kQ2hpbGQoX2NyZWF0ZVByb2plY3RCdXR0b24pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHMuZ2V0TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHByb2plY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgcHJvamVjdC5jbGFzc0xpc3QuYWRkKFwicHJvamVjdFwiKTtcbiAgICAgIHByb2plY3Quc2V0QXR0cmlidXRlKFwiZGF0YS1rZXlcIiwgaSk7XG4gICAgICBsZXQgcF93cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGxldCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICBsZXQgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgIGxldCBkZWZhdWx0Qm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgcF93cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJwLXdyYXBwZXJcIik7XG4gICAgICBkZWZhdWx0Qm94LnR5cGUgPSBcImNoZWNrYm94XCI7XG4gICAgICBkZWZhdWx0Qm94LmlkID0gYGRlZmF1bHQke2l9YDtcbiAgICAgIGlmIChpID09IHByb2plY3RzLmRlZmF1bHQpIHtcbiAgICAgICAgZGVmYXVsdEJveC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdEJveC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBkZWZhdWx0Qm94LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgX2NoYW5nZURlZmF1bHQpO1xuICAgICAgbGV0IGRlZmF1bHRCb3hMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgIGRlZmF1bHRCb3hMYWJlbC5pbm5lclRleHQgPSBcIkRlZmF1bHRcIjtcbiAgICAgIGRlZmF1bHRCb3hMYWJlbC5odG1sRm9yID0gYGRlZmF1bHQke2l9YDtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGRlZmF1bHRCb3hMYWJlbCk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZGVmYXVsdEJveCk7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZChcImNoZWNrYm94LXdyYXBwZXJcIik7XG4gICAgICBuYW1lLmlubmVyVGV4dCA9IHByb2plY3RzLmdldExpc3RbaV0ubmFtZTtcbiAgICAgIGRlc2NyaXB0aW9uLmlubmVyVGV4dCA9IHByb2plY3RzLmdldExpc3RbaV0uZGVzY3JpcHRpb247XG4gICAgICBwX3dyYXBwZXIuYXBwZW5kQ2hpbGQobmFtZSk7XG4gICAgICBwX3dyYXBwZXIuYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb24pO1xuICAgICAgcHJvamVjdC5hcHBlbmRDaGlsZChwX3dyYXBwZXIpO1xuICAgICAgcHJvamVjdC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgX3dyYXBwZXIuYXBwZW5kQ2hpbGQocHJvamVjdCk7XG4gICAgICBwX3dyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNob3d0b2Rvcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NoYW5nZURlZmF1bHQoZSkge1xuICAgICAgbGV0IGluZGV4ID0gZS50YXJnZXQuaWQucmVwbGFjZShcImRlZmF1bHRcIiwgXCJcIik7XG4gICAgICBsZXQgY2hlY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjZGVmYXVsdCR7cHJvamVjdHMuZGVmYXVsdH1gKTtcbiAgICAgIGNoZWNrLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICBjaGVjay5jaGVja2VkID0gZmFsc2U7XG4gICAgICBwcm9qZWN0cy5kZWZhdWx0ID0gaW5kZXg7XG4gICAgICBlLnRhcmdldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBlLnRhcmdldC5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIHNob3d0b2RvcyhlKSB7XG4gICAgbGV0IG51bTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XG4gICAgICBudW0gPSBlO1xuICAgIH0gZWxzZSB7XG4gICAgICBudW0gPSB0aGlzLnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1rZXlcIik7XG4gICAgICBjb25zb2xlLmxvZyhudW0pO1xuICAgIH1cbiAgICBfd3JhcHBlci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIF9idXR0b25zLmlubmVySFRNTCA9IFwiXCI7XG4gICAgX2J1dHRvbnMuYXBwZW5kQ2hpbGQoX2NyZWF0ZXRvZG9CdXR0b24pO1xuICAgIF9jcmVhdGV0b2RvQnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtcHJvamVjdFwiLCBudW0pO1xuICAgIGxldCB0ZW1wID0gcHJvamVjdHMuZ2V0RnJvbUxpc3QobnVtKTtcbiAgICBsZXQgbGlzdCA9IHRlbXAuZ2V0TGlzdDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHNob3dNaW5pbXVtdG9EbyhsaXN0W2ldLGkpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzaG93TWluaW11bXRvRG8ob2JqLGluZGV4KXtcbiAgICBsZXQgdG9kbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdG9kby5jbGFzc0xpc3QuYWRkKFwidG9kb1wiKTtcbiAgICB0b2RvLnNldEF0dHJpYnV0ZShcImRhdGEta2V5XCIsaW5kZXgpXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMykge1xuICAgICAgbGV0IHByb2plY3RuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHByb2plY3RuYW1lLmlubmVyVGV4dCA9IGFyZ3VtZW50c1syXTtcbiAgICAgIHRvZG8uYXBwZW5kQ2hpbGQocHJvamVjdG5hbWUpO1xuICAgIH1cbiAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBsZXQgZHVlRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbGV0IGNoZWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGNoZWNrLnR5cGUgPSBcImNoZWNrYm94XCI7XG4gICAgY2hlY2suaWQgPSBcImNvbXBsZXRlXCI7XG4gICAgbGV0IGNoZWNrbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgY2hlY2tsYWJlbC5odG1sRm9yID0gXCJjb21wbGV0ZVwiO1xuICAgIGNoZWNrbGFiZWwuaW5uZXJUZXh0ID0gXCJDb21wbGV0ZWRcIjtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY2hlY2spO1xuICAgIGRpdi5hcHBlbmRDaGlsZChjaGVja2xhYmVsKTtcblxuICAgIHRpdGxlLmlubmVyVGV4dCA9IG9iai50aXRsZTtcbiAgICBkdWVEYXRlLmlubmVyVGV4dCA9IG9iai5kdWVEYXRlO1xuXG4gICAgbGV0IGRldGFpbHNCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpXG4gICAgZGV0YWlsc0J1dHRvbi5pbm5lclRleHQgPSBcIkRldGFpbHNcIlxuICAgIGRldGFpbHNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZGV0YWlscylcbiAgICB0b2RvLmFwcGVuZENoaWxkKGRpdik7XG4gICAgdG9kby5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgdG9kby5hcHBlbmRDaGlsZChkdWVEYXRlKTtcbiAgICB0b2RvLmFwcGVuZENoaWxkKGRldGFpbHNCdXR0b24pO1xuICAgIF93cmFwcGVyLmFwcGVuZENoaWxkKHRvZG8pO1xuXG4gICAgZnVuY3Rpb24gZGV0YWlscyhlKXtcbiAgICAgIGxldCBpbmRleHRvZG8gPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEta2V5XCIpO1xuICAgICAgbGV0IGluZGV4cHJvamVjdCA9IF9jcmVhdGV0b2RvQnV0dG9uLmdldEF0dHJpYnV0ZShcImRhdGEtcHJvamVjdFwiKTtcbiAgICAgIHNob3d0b0RvKCgoKHByb2plY3RzLmdldExpc3QpW2luZGV4cHJvamVjdF0pLmdldExpc3QpW2luZGV4dG9kb10pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzaG93dG9EbyhvYmopIHtcbiAgICBfd3JhcHBlci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGxldCB0b2RvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0b2RvLmNsYXNzTGlzdC5hZGQoXCJ0b2RvLXdyYXBwZXJcIik7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuICAgICAgbGV0IHByb2plY3RuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHByb2plY3RuYW1lLmlubmVyVGV4dCA9IGFyZ3VtZW50c1syXTtcbiAgICAgIHRvZG8uYXBwZW5kQ2hpbGQocHJvamVjdG5hbWUpO1xuICAgIH1cbiAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBsZXQgZHVlRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIGxldCBwcmlvcml0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIGxldCBub3RlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIGxldCBjaGVja2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqLmNoZWNrbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBsZXQgY2hlY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICBjaGVjay50eXBlID0gXCJjaGVja2JveFwiO1xuICAgICAgY2hlY2suY2hlY2tlZCA9IG9iai5jaGVja2xpc3RbaV0udmFsdWU7XG4gICAgICBjaGVjay5pZCA9IGBjaGVjayR7aX1gO1xuICAgICAgbGV0IGNoZWNrbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICBjaGVja2xhYmVsLmh0bWxGb3IgPSBgY2hlY2ske2l9YDtcbiAgICAgIGNoZWNrbGFiZWwuaW5uZXJUZXh0ID0gYCR7b2JqLmNoZWNrbGlzdFtpXS5uYW1lfWA7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoY2hlY2spO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGNoZWNrbGFiZWwpO1xuICAgICAgY2hlY2tsaXN0LmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxldCBjaGVjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBjaGVjay50eXBlID0gXCJjaGVja2JveFwiO1xuICAgIGNoZWNrLmlkID0gXCJjb21wbGV0ZVwiO1xuICAgIGxldCBjaGVja2xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgIGNoZWNrbGFiZWwuaHRtbEZvciA9IFwiY29tcGxldGVcIjtcbiAgICBjaGVja2xhYmVsLmlubmVyVGV4dCA9IFwiQ29tcGxldGVkXCI7XG4gICAgZGl2LmFwcGVuZENoaWxkKGNoZWNrKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY2hlY2tsYWJlbCk7XG5cbiAgICB0aXRsZS5pbm5lclRleHQgPSBvYmoudGl0bGU7XG4gICAgZHVlRGF0ZS5pbm5lclRleHQgPSBvYmouZHVlRGF0ZTtcbiAgICBwcmlvcml0eS5pbm5lclRleHQgPSBvYmoucHJpb3JpdHk7XG4gICAgbm90ZXMuaW5uZXJUZXh0ID0gb2JqLm5vdGVzO1xuICAgIHRvZG8uYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB0b2RvLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICB0b2RvLmFwcGVuZENoaWxkKGR1ZURhdGUpO1xuICAgIHRvZG8uYXBwZW5kQ2hpbGQocHJpb3JpdHkpO1xuICAgIHRvZG8uYXBwZW5kQ2hpbGQobm90ZXMpO1xuICAgIHRvZG8uYXBwZW5kQ2hpbGQoY2hlY2tsaXN0KTtcbiAgICBfd3JhcHBlci5hcHBlbmRDaGlsZCh0b2RvKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2hvd015UHJvamVjdHMsXG4gIH07XG59KSgpO1xuXG5kb20uc2hvd015UHJvamVjdHMoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==