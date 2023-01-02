import format from "date-fns/format";
import differenceInHours from "date-fns/differenceInHours";
let storage = window.localStorage;

function saveproject() {
  let save = JSON.stringify(projects);
  storage.setItem("projects", save);
}
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
    setCheck(index, value) {
      this._checklist[index].value = value;
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
    let today = document.querySelector(".today");
    today.addEventListener("click", (e) => {
      e.preventDefault();
      showtodaytodos();
    });
    let upcoming = document.querySelector(".upcoming");
    upcoming.addEventListener("click", (e) => {
      e.preventDefault();
      showupcomingtodos();
    });
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
    duedate.type = "datetime-local";
    duedate.id = "duedate";
    duedate.required = "true";
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
      cont.classList.add("cont");
      let removebutton = document.createElement("input");
      removebutton.type = "image";
      removebutton.id = "delete";
      removebutton.setAttribute("data-rem", index);
      removebutton.addEventListener("click", removecheck);
      removebutton.src = "./icons/delete.svg";

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
      if (form.checkValidity()) {
        let titleText = title.value;
        let descriptionText = description.value;
        let duedatetext = new Date(duedate.value);
        let prioritytext = priority.value;
        let notestext = notes.value;
        let checklistvalue = [];
        for (let i = 0; i < checklist.length; i++) {
          if (checklist[i].value != "") {
            checklistvalue.push(checklist[i].value);
          }
        }

        let num = _createtodoButton.getAttribute("data-project");
        projects.getList[num].addToList(
          titleText,
          descriptionText,
          duedatetext,
          prioritytext,
          notestext,
          checklistvalue
        );
        saveproject();
        e.preventDefault();
        showtodos(num, true);
      }
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
        saveproject();
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
      saveproject();
    }
  };
  function showtodos(e) {
    let num;
    if (arguments.length == 2) {
      num = e;
    } else {
      num = this.parentElement.getAttribute("data-key");
    }
    _wrapper.innerHTML = "";
    _buttons.innerHTML = "";
    _buttons.appendChild(_createtodoButton);
    _createtodoButton.setAttribute("data-project", num);
    let temp = projects.getFromList(num);
    let list = temp.getList;
    for (let i = 0; i < list.length; i++) {
      showMinimumtoDo(list[i], i, num,showtodos);
    }
  }
  function showMinimumtoDo(obj, todoindex, projectindex,reference) {
    let todo = document.createElement("div");
    todo.classList.add("todo");
    todo.setAttribute("data-key", todoindex);
    todo.setAttribute("data-project", projectindex);
    if (arguments.length == 5) {
      let projectname = document.createElement("div");
      projectname.innerText = projects.getFromList(projectindex).name;
      projectname.id = "projectnamediv";
      todo.appendChild(projectname);
    }
    let title = document.createElement("p");
    let dueDate = document.createElement("p");

    let div = document.createElement("div");
    div.id = "completecontainer";
    let check = document.createElement("input");
    check.type = "checkbox";
    check.id = "complete";
    check.checked = obj.completed;
    check.addEventListener("click", completetodo);
    let checklabel = document.createElement("label");
    checklabel.htmlFor = "complete";
    checklabel.innerText = "Completed";
    div.appendChild(checklabel);
    div.appendChild(check);
 
    title.innerText = obj.title;
    dueDate.innerText = format(obj.dueDate, "Pp");
    let detailsButton = document.createElement("button");
    detailsButton.innerText = "Details";
    detailsButton.addEventListener("click", details);
    todo.appendChild(div);
    todo.appendChild(title);
    todo.appendChild(dueDate);
    todo.appendChild(detailsButton);
    _wrapper.appendChild(todo);

    function details(e) {
      let indextodo = e.target.parentElement.getAttribute("data-key");
      let indexproject = e.target.parentElement.getAttribute("data-project");
      
      showtoDo(projects.getList[indexproject].getList[indextodo], indextodo,indexproject , reference);
    }
  }
  function showtoDo(obj, indextodo,projectindex,reference) {
    _wrapper.innerHTML = "";
    let todo = document.createElement("div");
    todo.classList.add("todo-wrapper");
    todo.setAttribute("data-key", indextodo);
    todo.setAttribute("data-project", projectindex);
    if (arguments.length == 5) {
      let projectname = document.createElement("div");
      projectname.innerText = projects.getFromList(projectindex).name;
      projectname.id = "projectnamediv";
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
      check.addEventListener("change", changechecktodo);
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
    check.checked = obj.completed;
    check.addEventListener("click", completetodo);
    let checklabel = document.createElement("label");
    checklabel.htmlFor = "complete";
    checklabel.innerText = "Completed";
    div.appendChild(check);
    div.appendChild(checklabel);

    title.innerText = obj.title;
    dueDate.innerText = format(obj.dueDate, "Pp");
    priority.innerText = obj.priority;
    notes.innerText = obj.notes;
    todo.appendChild(div);
    todo.appendChild(title);
    todo.appendChild(dueDate);
    todo.appendChild(priority);
    todo.appendChild(notes);
    todo.appendChild(checklist);
    _wrapper.appendChild(todo);
    let backButton = document.createElement("button");
    backButton.id = "back";
    backButton.innerText = "Done.";

    backButton.type = "button";
    backButton.addEventListener("click", back);
    todo.appendChild(backButton);
    function back(e) {
      let indexproject = _createtodoButton.getAttribute("data-project");
      reference(indexproject,true);
    }
  }
  function completetodo(e) {
    let indextodo =e.target.parentElement.parentElement.getAttribute("data-key");
    let indexproject = e.target.parentElement.parentElement.getAttribute("data-project");
    projects.getFromList(indexproject).getList[indextodo].completed = true;
    saveproject();
  }
  function changechecktodo(e) {
    let indexcheck = e.target.id.replace("check", "");
    let indextodo =
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-key"
      );
    let indexproject = e.target.parentElement.parentElement.parentElement.getAttribute("data-project");
    projects
      .getFromList(indexproject)
      .getList[indextodo].setCheck(indexcheck, e.target.value);
    saveproject();
  }
  return {
    _buttons,
    _wrapper,
    showMyProjects,
    showMinimumtoDo,
    showtodos,
  };
})();
function showtodaytodos() {
  dom._buttons.innerHTML = "";
  dom._wrapper.innerHTML = "";
  for (let i = 0; i < projects.getList.length; i++) {
    let project = projects.getList[i];
    for (let j = 0; j < project.getList.length; j++) {
      let now = new Date();
      let dateDue = project.getList[j].dueDate;
      if (
        differenceInHours(
          dateDue,
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0)
        ) <= 24
      ) {
        dom.showMinimumtoDo(project.getList[j], j, i,showtodaytodos, true);
      }
    }
  }
}
function showupcomingtodos() {
  dom._buttons.innerHTML = "";
  dom._wrapper.innerHTML = "";
  for (let i = 0; i < projects.getList.length; i++) {
    let project = projects.getList[i];
    for (let j = 0; j < project.getList.length; j++) {
      let now = new Date();
      let dateDue = project.getList[j].dueDate;
      if (
        differenceInHours(
          dateDue,
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0)
        ) > 24
      ) {
        dom.showMinimumtoDo(project.getList[j], j, i,showupcomingtodos, true);
      }
    }
  }
}

function getbackmethods(value) {
  delete value.getList;
  delete value.default;
  Object.assign(projects, value);
  for (let i = 0; i < projects.getList.length; i++) {
    let oldproject = projects.getList[i];
    let newproject = project();
    delete oldproject.getList;
    Object.assign(newproject, oldproject);
    projects.getList[i] = newproject;
    for (let j = 0; j < newproject.getList.length; j++) {
      let newtodo = todo("", "", "", "", "", "");
      let oldtodo = newproject.getList[j];
      delete oldtodo.checklist;
      Object.assign(newtodo, oldtodo);
      newproject.getList[j] = newtodo;
      newtodo.dueDate = new Date(newtodo.dueDate);
      for (let k = 0; k < newtodo.checklist.length; k++) {
        let newcheck = check();
        let oldcheck = newtodo.checklist[k];
        Object.assign(newcheck, oldcheck);
        newtodo.checklist[k];
      }
    }
  }
}
if (storage.getItem("projects") == null) {
  dom.showMyProjects();
} else {
  let temp = storage.getItem("projects");
  let value = JSON.parse(temp);
  getbackmethods(value);
  let defaultindex = projects.default;
  dom.showtodos(defaultindex, true);
}
