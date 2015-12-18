#pragma strict
//server data
var nodeData : WWW;
//server url
var nodeUrl : String;
//x coordinates of object
private var posX : float;
//refresh rate for server update
var refreshRate : float = 0.3f;
//lerp factor
private var lerpFactor : float = 0f;
//lerp speed
var speed : float = 1f;

function Start () {
  //contacting server to update local values
  if (nodeUrl)
    nodeData = new WWW (nodeUrl);
  yield nodeData;
  //updating local posx with data
  if (nodeData.isDone && !nodeData.error)
    posX = parseFloat(nodeData.text);
  else
    posX = transform.position.x;
  transform.position.x = posX;
  //unity hack to prevent weird queing on Update()
  InvokeRepeating("GetData", 0, refreshRate);
}

//retrieve data from server
function GetData(){
  nodeData = new WWW (nodeUrl);
}

//updates movement from client to server
function SendToNode(position : String){
  var formData : WWWForm = new WWWForm();
  formData.AddField("posx", position);
  var sendData = new WWW(nodeUrl, formData);
  yield sendData; //waiting for the message to process
  // checking for errors
  if(sendData.error){
    Debug.Log(sendData.error);
  }
  else{
    Debug.Log("DATA SENT: " + formData.data);
  }
}

function MoveObject(){
  posX = parseFloat(nodeData.text);
  //lerp code goes here
  transform.position.x = posX;
}

function Update () {

  //update movement
  if(nodeData.isDone){
    if(nodeData.error){
      Debug.Log(nodeData.error);
    }
    else{
      MoveObject();
    }
  }

  //moving x axis
  if (Input.GetKeyDown(KeyCode.K)){
    posX++;
    SendToNode(posX.ToString());
    lerpFactor = 0f;
  }

  if (Input.GetKeyDown(KeyCode.R)){
    SendToNode("0");
  }
}
