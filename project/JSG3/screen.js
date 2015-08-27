/**
 * Created by Administrator on 2015/7/22.
 */

var  arr = [
    {"name":"li1","age":"60","sex":"man"},
    {"name":"liu2","age":"40","sex":"woman"},
    {"name":"hua3","age":"50","sex":"man"}
];

function compare(value1,value2){
    console.log(value1,value2);
    return value1.age- value2.age;
};

arr.sort(compare);
console.log(arr);


var objectList2 = new Array();
function WorkMate(name,age){
    this.name=name;
    var _age=age;
    this.age=function(){
        if(!arguments)
        {
          _age=arguments[0];}
        else
        {
            return _age;}
    }

}
objectList2.push(new WorkMate('jack',20));
objectList2.push(new WorkMate('tony',25));
objectList2.push(new WorkMate('stone',26));
objectList2.push(new WorkMate('mandy',23));
//按年龄从小到大排序
objectList2.sort(function(a,b){
    return a.age()-b.age();
});
objectList2[2].age(55);
console.log(objectList2[2]);
for(var i=0;i<objectList2.length;i++){
      console.log('age:'+objectList2[i].age()+' name:'+objectList2[i].name);
}

var re = null,i;
for(i = 0;i <10;i++){
    re = /cat/g;
    console.log(re.test("catastrophe"));
}
console.log();
for(i = 0;i <10;i++){
    re = new RegExp("cat","g");
    console.log(re.test("catastrophe"));
}

var  arr = [
    {"name":"li1","age":"60","sex":"man"},
    {"name":"liu2","age":"40","sex":"woman"},
    {"name":"hua3","age":"50","sex":"man"}
];

function createComparisonFunction(propertyName){
    return function(value1,value2){
        return value1[propertyName]- value2[propertyName];
    };
}
arr.sort(createComparisonFunction("age"));
console.log(arr);

function outer(){inner();}
function inner(){
    alert(arguments.callee.caller);
}
 outer();


function sum(num1,num2){
    console.log(this);
    return num1 + num2;
}
function callSum1(num1,num2){
    return sum.apply(this,arguments);
}
console.log(callSum1(20,10));
var o = {};
o.callSum1 = callSum1;
var ss = sum.call(o,50,10);
console.log(o.callSum1(20,10));

var person = {};
Object.defineProperty(person,"name",{
    configurable:false,
    value:"Nicholas"
});

function Person (){};
Person.prototype.name="lili";
Person.prototype.age = "22";
Person.prototype.sayName = function(){
  console.log("你好：" + this.name) ;
};
Person.prototype.like = ["red"];
var p1 = new Person();
p1.name = "huer";
p1.sayName();
p1.like = ["purple"];
p1.like.push("pink");
console.log(Object.getOwnPropertyDescriptor(Person,name));
var p2 = new Person();
p2.sayName();
console.log(p2.like);

var person = {
    name:"Nicholas",
    friends:["Shelby","Court","Van"]
};

var anotherPerson = Object.create(person,{
    name:{
        value:"Court"
    }
});
anotherPerson.friends.push("liLi");
console.log(anotherPerson.friends);
console.log(person.friends);


//寄生组合式继承
function object(o){
  function F(){};
    F.prototype = o;
    return new F();
}
function inheritPrototype(subType,superType){
    var prototype = object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
function SuperType(name){
    this.name = name;
    this.colors = ["red","blue","green"];
};
SuperType.prototype.sayName= function(){
    alert(this.name);
};
function SubType(name,age){
    SuperType.call(this,name);
    this.age = age;
}
inheritPrototype(SubType,SuperType);
SubType.prototype.sayAge = function(){
    alert(this.age);
};
var instance = new SubType("Nocholas",29);
instance.sayAge();
//寄生组合式继承

//闭包与变量
/*function createFunctions(){
    var result = new Array();
    for(var i = 0; i < 10;i++){
        result[i] = (function(){
            return i;
        })();
    }
    return result;
}
 var resultVal = createFunctions();
 console.log(resultVal);
*/
function createFunctions(){
    var result = new Array();
    for(var i = 0; i < 10;i++){
        result[i] = function(num){
            return function(){
                return num;
            };
        }(i);
    }
    return result;
}
var resultVal = createFunctions();
console.log(resultVal);

var name = "bbb";
var o = {"name":"aaa"};
o.acb = function(){
    return this.name;
};

console.log((o.acb = o.acb)() );
console.log(o.acb() );

var name = "bbb";
var o = {"name":"aaa"};
o.acb = function(){
    return function(){
            return this.name;
        };
};
console.log((o.acb = o.acb)()() );
console.log(o.acb()() );

function outputNumbers(count){
    (function(){
        for(var irr = 0 ; irr < count;irr++){
            console.log(irr);
        }
    })();
    alert(irr);//将导致一个错误
}
outputNumbers(3);

if(1==1){
    var a = 12;
    if(2==2){
        var a = 3;
    }
    console.log(a)
}
(function(){
    //这里是块级作用域
})();

!function(){
    //这里是块级作用域
}(); //正确！

(function(){
    var name = "";
    Person = function(value){
      name = value;
    };

    Person.prototype.getName = function(){
        return name;
    };

    Person.prototype.setName = function(value){
        name = value;
    };

})();

var p1= new Person();
var p2= new Person();
p1.setName("huahua");
console.log(p2.getName());

