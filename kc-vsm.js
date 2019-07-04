function fileChange(ev) {
  let target = ev.target;
  let files = target.files;
  let file = files[0];
  let size = file.size;

  reader.onloadend = function (evt) {
    if (evt.target.readyState == FileReader.DONE) {
      init();
      setASM(reader.result);
      viewIseg();
      viewStack();
      viewVseg();
    }
  }
  reader.readAsText(file, "UTF-8");
}

function output(str) {
  let output = document.getElementById("output");
  output.innerText += str;
}

function output_clear(str) {
  let output = document.getElementById("output");
  output.innerText = "";
}

function viewIseg() {
  let table = document.getElementById("iseg_table");
  table.innerHTML = "";
  if (typeof asm == "undefined" || asm.length == 0) return;
  let t = document.createElement("table");
  let rows = [];
  for (i = 0; i < asm.length - 1; i++) {
    rows.push(t.insertRow(-1));
    cell = rows[i].insertCell(-1);
    cell.appendChild(document.createTextNode(i));
    if (i == counter) cell.style.backgroundColor = "#bbb";
    cell = rows[i].insertCell(-1);
    cell.appendChild(document.createTextNode(asm[i][0]));
    if (i == counter) cell.style.backgroundColor = "#bbb";
    cell = rows[i].insertCell(-1);
    cell.appendChild(document.createTextNode(asm[i][1]));
    if (i == counter) cell.style.backgroundColor = "#bbb";
  }
  table.appendChild(t);
}

function viewVseg() {
  let table = document.getElementById("mem_table");
  table.innerHTML = "";
  let t = document.createElement("table");
  let rows = [];
  mem = current.mem;
  for (i = 0; i < mem.length; i++) {
    rows.push(t.insertRow(-1));
    cell = rows[i].insertCell(-1);
    cell.appendChild(document.createTextNode(i));
    cell = rows[i].insertCell(-1);
    cell.appendChild(document.createTextNode(mem[i]));
  }
  table.appendChild(t);
}

function viewStack() {
  let table = document.getElementById("stack_table");
  table.innerHTML = "";
  if (current.stack.length == 0) return;
  let t = document.createElement("table");
  let rows = [];
  stack = current.stack;
  for (i = 0; i < stack.length; i++) {
    rows.push(t.insertRow(-1));
    cell = rows[i].insertCell(-1);
    cell.appendChild(document.createTextNode(i));
    cell = rows[i].insertCell(-1);
    cell.appendChild(document.createTextNode(stack[i]));
  }
  table.appendChild(t);
}

function setASM(str) {
  let lines = str.split("\n");
  str.split("\n").forEach(element => {
    let a = element.split("	");
    asm.push([a[0], (typeof a[1] == "undefined") ? "" : a[1]]);
  });
  //console.log(asm);
}

function next(flag) {
  if (typeof asm == "undefined") return;
  res = operation(asm[counter][0], asm[counter][1]);
  if (flag) {
    console.log(res);
    viewIseg();
    viewStack();
    viewVseg();
  }
}

function finish() {
  while (!HALT) {
    next(false);
  }
  viewIseg();
  viewStack();
  viewVseg();
}

function operation(opCode, addr) {
  if (HALT) {
    return current.stack;
  }
  addr = Number(addr);
  current = {
    num: current.num + 1,
    operation: opCode + " " + addr,
    stack: current.stack.slice(),
    mem: current.mem.slice()
  };
  current.operation = opCode;
  switch (opCode) {
    case "PUSHI":
      current.stack.push(addr);
      break;
    case "PUSH":
      current.stack.push(current.mem[addr]);
      break;
    case "CSIGN":
      current.stack.push(current.stack.pop() * -1);
      break;
    case "ADD":
      current.stack.push(current.stack.pop() + current.stack.pop());
      break;
    case "SUB":
      b = current.stack.pop();
      a = current.stack.pop();
      current.stack.push(a - b);
      break;
    case "MUL":
      current.stack.push(current.stack.pop() * current.stack.pop());
      break;
    case "DIV":
      b = current.stack.pop();
      a = current.stack.pop()
      if (b === 0) {
        output("Zero divider detected\n");
        HALT = true;
      }
      current.stack.push(a / b);
      break;
    case "MOD":
      b = current.stack.pop();
      a = current.stack.pop();
      if (b === 0) {
        output("Zero divider detected\n");
        HALT = true;
      }
      current.stack.push(a % b);
      break;
    case "AND":
      b = current.stack.pop();
      a = current.stack.pop();
      current.stack.push(b && a);
      break;
    case "OR":
      b = current.stack.pop();
      a = current.stack.pop();
      current.stack.push(a || b);
      break;
    case "NOT":
      current.stack.push(Number(!current.stack.pop()));
      break;
    case "COMP":
      a = current.stack.pop();
      b = current.stack.pop();
      (b > a) ? current.stack.push(1) :
        (b < a) ? current.stack.push(-1) :
          current.stack.push(1);
      break;
    case "COPY":
      current.stack.push(current.stack[current.stack.length - 1]);
      break;
    case "POP":
      current.mem[addr] = current.stack.pop();
      break;
    case "INC":
      current.stack.push(current.stack.pop() + 1);
      break;
    case "DEC":
      current.stack.push(current.stack.pop() - 1);
      break;
    case "JUMP":
      counter = addr - 1;
      break;
    case "BLT":
      if (current.stack.pop() < 0) {
        counter = addr - 1;
      }
      break;
    case "BLE":
      if (current.stack.pop() <= 0) {
        counter = addr - 1;
      }
      break;
    case "BEQ":
      if (current.stack.pop() == 0) {
        counter = addr - 1;
      }
      break;
    case "BNE":
      if (current.stack.pop() != 0) {
        counter = addr - 1;
      }
      break;
    case "BGE":
      if (current.stack.pop() >= 0) {
        counter = addr - 1;
      }
      break;
    case "BGT":
      if (current.stack.pop() > 0) {
        counter = addr - 1;
      }
      break;
    case "INPUT":
      input = prompt("INPUT");
      if (input == null || input == "") return;
      output(input + "\n");
      current.stack.push(Number(input[0]));
      break;
    case "INPUTC":
      inputc = prompt("INPUTC");
      if (inputc == null || inputc == "") return;
      output(inputc + "\n");
      current.stack.push(Number(inputc.charCodeAt(0)));

      break;
    case "REMOVE":
      a = current.stack.pop();
      if (typeof a == "undefined") {
        output("Stack Pointer Error : -1");
        HALT = true;
      }
      break;
    case "OUTPUT":
      output(current.stack.pop());
      break;
    case "OUTPUTC":
      output(String.fromCharCode(current.stack.pop()));
      break;
    case "OUTPUTLN":
      output("\n");
      break;
    case "LOAD":
      current.stack.push(current.mem[current.stack.pop()]);
      break;
    case "ERR":
      break;
    case "HALT":
      HALT = true;
      history.push(Object.assign({}, current));
      return;
    case "ASSGN":
      b = current.stack.pop();
      a = current.stack.pop();
      current.mem[a] = b;
      current.stack.push(b);
      break;
  }
  history.push(Object.assign({}, current));
  counter++;
  return current.stack;
}

function init() {
  counter = 0;
  current = {
    num: 0,
    operation: "",
    stack: [],
    mem: new Array(50).fill(0)
  };
  history = [];
  asm = [];
  HALT = false;
  output_clear();
}

document.onkeydown = function (e) {
  let code = e.keyCode;
  let shift_key = e.shiftKey;
  let ctrl_key = e.ctrlKey;
  let alt_key = e.altKey;

  if (code == 40 && !shift_key && !ctrl_key && !alt_key) {
    next(true);
  } else if (code == 65 && shift_key && !ctrl_key && !alt_key) {
    finish()
  }
}

let inputFile = document.getElementById("file");
let reader = new FileReader();
inputFile.addEventListener("change", fileChange, false);

let counter = 0;
let current = {
  num: 0,
  operation: "",
  stack: [],
  mem: new Array(50).fill(0)
};
let history = [];
let asm = [];
let HALT = false;
