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
