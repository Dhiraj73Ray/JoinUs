# JOIN US
<h3>This is a node_express app. Simply made for illustrating the connection between MySQL and Node.js</h3>

## Step 1
Download & install [Node.js]()  and  []() 
This is the [Requirements.txt](https://github.com/Dhiraj73Ray/JoinUs/blob/main/requirements.txt) file. After extracting this folder first install all dependencies.

### There also a joke route where you can read different jokes everytime
```
app.get("/joke", async (req, res) => {
  try {
    const response = await axios.get(
      "https://official-joke-api.appspot.com/random_joke"
    );
    res.send(response.data.setup + "\n" + response.data.punchline);
  } catch (error) {
    res.status(500).send("Error fetching a joke");
  }
});
```
### Just type
