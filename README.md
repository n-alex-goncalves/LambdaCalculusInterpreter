# Lambda Calculus Interpreter :computer:

[This is a single-line interpreter for the lambda calculus system](https://n-alex-goncalves.github.io/LambdaCalculusInterpreter/)

- Built in the **HTML/CSS/JavaScripts**
- User Interface built with **Bootstrap** and **JQuery**
- Tested using **Jest** and **Node.JS**

The interpreter uses an applicative-order evaluation strategy to perform beta reduction on a lambda term. The interpreter can reduce complicated lambda expressions and also simulate SKI combinators and boolean logic (see notation at bottom).

The interpreter was built by considering the lambda calculus system as a tree-like data structure. The program parses the tree iteratively to find the beta normal form of the lambda expression. 

## Demo
![](https://github.com/n-alex-goncalves/Lambda-Calculus-Interpreter/blob/main/interpreterGif.gif)

## Tested with over 80 lambda expressions from various books and websites  
![](https://github.com/n-alex-goncalves/Lambda-Calculus-Interpreter/blob/main/testcasesGif.gif)

# SKI Combinators & Boolean Logic Notation

NOT   == C  
TRUE  == K  
FALSE == KI  
AND   == (\pq.pq(KI))  
OR    == (\pq.pKq) 

Note that the above notation is in prefix. So instead of TRUE AND FALSE, the input should be AND TRUE FALSE. 

# Dependencies

Thanks go to the following few authors:

[jQuery](https://jquery.com/)  
[jQuery Terminal](https://terminal.jcubic.pl/)  
[BootStrap](https://getbootstrap.com/)  

