import './App.css';
// import Tests from './tests.json';
// import Users from './users.json';
import {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
import Alert from "react-bootstrap/Alert"
const backend_url = "https://shrouded-island-44163.herokuapp.com/"


var users;
fetch(backend_url+'getUser/')
              .then(res=>res.json())
              .then(res=>users=res.users)
              .catch(err=>console.log(err));
var tests;
fetch(backend_url+'getTests/')
              .then(res=>res.json())
              .then(res=>tests=res.tests)
              .catch(err=>console.log(err));


function Test(props){
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [qNum, setQ] = useState(0);

  // useEffect = () => {
  //   document.title = `Question ${qNum+1}`
  // }
  console.log(props.user)
  let {id} = useParams();
  let testID = id;
  //console.log(testID) 
  //console.log(tests)
  for(let i of tests){
    if(i.id == testID){
      //console.log(i)
      var questions = i.questions;
      break;
    }
  }

  var RenderQ = function(){
    //console.log(questions[qNum].selectedid)
    return(
      <div className='Qcon'>
        <div className='question'>
          <div className='qT'>Statement</div>
          <div className='statement'>{questions[qNum].text}</div>
        </div>
        <div className='options'>
          {questions[qNum].options.map((ele, idx) => (<div key={idx} className={(questions[qNum].selectedid==idx+1)?'active':'option'} onClick={()=>selectHandler(idx+1)} id={idx+1}>{ele.info}</div>))}
        </div>
      </div>
    );
  }
  
  var selectHandler = function(i){
    questions[qNum].selectedid=i;
    let ac = document.querySelector('.active');
    if(ac){
      console.log(ac.className)
      ac.className = 'option';
    }
    let temp = document.getElementById(i);
    if(temp){
      temp.className = 'active';
    }
    
  }

  var next = function(){
    qNum==(questions.length-1)?setQ((prevQ) =>prevQ):setQ((prevQ) =>prevQ+1);
    if(qNum==questions.length-1){
      sub();
    }
  }

  var prev = function(){
    (qNum==0)?setQ(0):setQ((prevQ) =>prevQ-1);
    selectHandler(questions[qNum].selectedid);
  }  

  var sub = function(){
    let x = window.confirm("Press OK to submit, else press Cancel to go back");
    if(x){
      var count = 0;
      for(let i of questions){
        if(i.selectedid === i.correctid){
          count++;
        } 
      }
      for(let i of questions){
        i.selectedid = 0;
      }
      let inf = {
        user: props.user,
        score: count,
        test: testID
      }
      let reqOptions = {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(inf)
      }
      let submitted = false;
      fetch(backend_url+"updateTest/", reqOptions)
        .then(res=>{console.log(res); submitted=true;setDone(submitted);})
        .catch(err=>console.log(err))
      fetch(backend_url+"updateDBQ/")
        .catch(err=>console.error(err));
      setScore(count);
    }
    else{
      setDone(false);
    }
  }
  //console.log(questions[qNum].selectedid)
  // console.log(qNum);

  
  return (
    <div className="App">
      {done?(
        <>
        <div className='con'>
          Your Score: &nbsp;
          <div className='score'> {score}</div>
        </div>
        <Link className='op' to='/'>
          Home
        </Link>
        </>
      ):(
        <>
          <div className='qInfo'>
            <div className='info'>Question {qNum+1}<span className='qLen'>/{questions.length}</span></div>
          </div>
          <RenderQ/>
          <div className="buttons">
            <span className='subm'><div className='op' onClick={sub}>Submit</div></span>
            <span className='nav'>
            <div className='op' id='prev' onClick={prev}>Prev</div>
            <div className='op' id='next' onClick={next}>Next</div></span>

          </div>
        </>
      )
      }
    </div>
  );
}

function Login(props){
  var setLogged = props.setLogged;
  var setError = props.setError;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [valid, setValid] = useState(false);
  
  //console.log(username); 

  var handleChangeName = (event) => {
    setUsername(event.target.value);
  }
  var handleChangePass = (event) => {
    //console.log(password);
    setPassword(event.target.value);
  }
  var user=undefined
  // var handleValid = () =>
  // {
  //   for(let i of users){
  //     if(i.username == username&&i.password == password){
  //       var user = i;
  //       setValid(true);
  //       break;
  //     }
  //     else{
  //       var user = undefined;
  //       setValid(false);
  //     }
  //   }
  // }

  var handleSubmit = (event) => {
    let valid = 0;
    let i;
    for(i of users){
      if(i.username == username&&i.password == password){
        var user = i;
        valid = 1;
        break;
      }
    }
    if(valid){
      setLogged(i)
    }
    else{
      console.log("Brooo")
      setError('Login Error')
    }
  
}

  return(

    <div className="App">
      <div className="loginTitle">
        Welcome to CBT Taker
      </div>
      <div className='formDeets'>
        <div className='formMessage'>
          Enter your details to Login
        </div>
        <form>
          <label>Username</label>
          <br/>
          <input className='userInput' type="text" id="username" placeholder='Username' value={username} onChange={handleChangeName}></input> 
          <br/>
          <label >Password</label>
          <br/>
          <input className='userInput' type="password" id="password" placeholder='Password' value={password} onChange={handleChangePass}></input> 
          <div className='op' id="loginButton" onClick={handleSubmit}>Login</div>  
        </form>
        <div>
          Don't have ID? <Link id="registerLink" to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
}

function Signup(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  var handleChangeName = (event) => {
    console.log(username);
    setUsername(event.target.value);
  }
  var handleChangePass = (event) => {
    console.log(password);
    setPassword(event.target.value);
  }

  return(
    <div className="App">
      <div className='formMessage'>
        Enter your details to Signup
      </div>
      <form>
        <label for="username">Username</label>
        <br/>
        <input className='userInput' type="text" id="username" placeholder='Username' value={username} onChange={handleChangeName}></input> 
        <br/>
        <label for="password">Password</label>
        <br/>
        <input className='userInput' type="password" id="password" placeholder='Password' value={password} onChange={handleChangePass}></input> 
        <Link className='op' id="registerButton" to="/user">Signup</Link>
      </form>
      <div>
        Already have an ID? <Link id="loginLink" to="/">Login</Link>
      </div>
    </div>
  );
}

function Card(props){
  let duration = tests.find(ele=>ele.id==props.test.id).duration
  let topic = tests.find(ele=>ele.id==props.test.id).topic
  return(
    <div className='testcard'>
      <div>Topic: {topic}</div>
      <div>Status: {props.test.completed?("Taken"):("Not Taken")}</div>
      <div>Score: {props.test.score}</div>
      <div>Duration: {duration}</div>
      <Link className='op' id="take_test" to={props.test.completed?"/":"/test/"+props.test.id}>Take Test</Link>
    </div>
  );
}

function Home(props){
  const [curr_users, setUsers] = useState(users)
  useEffect(() => {
    fetch(backend_url+'getUser/')
      .then(res=>res.json())
      .then(res=>{users=res.users; setUsers(users)})
      .catch(err=>console.log(err));
      //causes bug
      
  });
  
  let user_tests = curr_users.find(item=>item.username==props.user.username).tests;
  //console.log(user_tests)
  return(
    <div className='App_bigger'>
      <div className='intro'> Welcome to CBT Interface, {props.user.username}</div>
      <div className='tests'>
        {user_tests.map((test, idx) => {if(test) return <Card test={test} key={idx}/>})}
      </div>
    </div>
  );
}

function Error(props){
  var eraseError = () => {
    props.setError(undefined)
  }
  return(
    <div className='App'>
      <Alert variant='danger'>Error!!</Alert>
      <div className='errorMessage'>{props.error}</div>
      <div className='op' onClick={eraseError}>Take me home</div>
    </div>
  )
}

function App() {
  //console.log(questions[2].selectedid)
  const [logged, setLogged] = useState(undefined); 
  const [error, setError] = useState(undefined);

  useEffect(() => {
    fetch(backend_url+'getUser/')
      .then(res=>res.json())
      .then(res=>users=res.users)
      .catch(err=>console.log(err));
    
  });

  if(error){
    return(
      <Router>
        <Routes>
          <Route path='/' element={<Error error={error} setError={setError}></Error>}></Route>
        </Routes>
      </Router>
    );
  }
  else if(!logged) return(
    <Router>
      <Routes>
        <Route path='/' element={<Login setLogged={setLogged} setError={setError}></Login>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>

      </Routes>
    </Router>
  )
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Home user={logged}></Home>}></Route>
        <Route path='/test/:id' element={<Test user={logged}></Test>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;


