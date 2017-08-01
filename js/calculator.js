//计算器

var calc = document.querySelector('.calculator')
drag(calc);
var btn = calc.querySelectorAll('nav a');
btn[0].addEventListener('click', function (e) {
  e.stopPropagation();
  calc.style.display = "none";
})
btn[1].addEventListener('click', function (e) {
  e.stopPropagation();
  calc.style.display = "none";
});


(function () {
  var p = document.querySelector('.num>p');
  var num = document.querySelectorAll('.btn td');
  var a = 0; //记录按下运算符之前的数字
  var b = 0; //记录按下运算符之后的数字;
  var oper = ""; //保存输入的操作符
  function Calculator(a, b, oper) {
    var result = 0
    switch (oper) {
      case 'AC':
        p.innerHTML = '0';
        a = '';
        break;
      case '⁺⧸₋':
        // p.innerHTML = '⁺⧸₋';
        break;
      case '%':
        //  p.innerHTML = '%';
        break;
      case '÷':
        // p.innerHTML = '÷';
        result = a / b
        break;
      case '×':
        //  p.innerHTML = '×';
        result = a * b
        break;
      case '-':
        //  p.innerHTML = '-';
        result = a - b
        break;
      case '+':
        //  p.innerHTML = '+';
        result = a + b
        break;
      case '=':
        //  p.innerHTML = result;
        break;
    }
    return result
  }
  for (var i = 0; i < num.length; i++) {
    p.innerHTML = ''; //清空运算数字
    num[i].onclick = function () {
      p.innerHTML = '';
      a += this.innerHTML
      p.innerHTML = a;
      a = parseFloat(a);
      console.log(a)
    }

  };

  /*输入操作符*/
  function inputOper() {

    if (p.innerHTML == "+") {
      //保存上次计算结果，并对字符串进行转换Number类型
      b = parseFloat(a);
      //第一次输入的值设置为空
      p.innerHTML = "";
    } else if (p.innerHTML == "-") {
      b = parseFloat(a);
      p.innerHTML = "";
    } else if (p.innerHTML == '×') {
      b = parseFloat(a);
      p.innerHTML = "";
    } else if (p.innerHTML == '÷') {
      b = parseFloat(a);
      p.innerHTML = "";
    }
    console.log(b)
  };
  /*计算结果*/
  function inputEquel() {

    if (p.innerHTML == "=") {
      p.innerHTML = calculator(b, a, oper);
      console.log(calculator(b, a, oper))
    }
  }
})()