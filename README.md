# Lambda Calculus Interpreter

[This is a single-line interpreter for the Lambda Calculus](https://nunoagoncalves.github.io/Lambda-Calculus-Interpreter/)

- Built in the **HTML/CSS/JavaScripts**
- User Interface built with **Bootstrap** and **JQuery**
- Tested using **Jest** and **Node.JS**

The interpreter uses an applicative-order evaluation strategy to perform beta reduction. The interpreter can reduce complicated Lambda expressions, and it can also simulate SKI combinators and boolean logic (see notation at bottom).

The interpreter was created by considering the Lambda Calculus system as a tree and parsing the tree in iterative steps to find the beta normal form of the expression.

## Reduces lambda terms succesfully  
![](https://github.com/NunoAGoncalves/Lambda-Calculus-Interpreter/blob/main/interpreterGif.gif)

## Tested with over 80 lambda expressions from various books and websites  
![](https://github.com/NunoAGoncalves/Lambda-Calculus-Interpreter/blob/main/testcasesGif.gif)

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

