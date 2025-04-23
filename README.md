# CodeBoxx_9_MERN_Codeblogg
---

## Configuration

- Create .env
- Copy Paste the key=value received from the admin 


- NPM install in /server folder
- `npm start` in /server folder to start the server side


- NPM install in /client folder
- `npm start` in /client folder to start the client side
---

## Color Palette
```
#403E6B (Delft Blue)
#D3D1EE (Lavender (web))
#8D88EA (Tropical indigo)
#B1ADFF (Periwinkle
#5F5E6B (Dim gray)
#6E6AB8 (Slate blue)
```
---

## Research Document:
- What, if any **DATA** is required from the backend to render the wireframe?
    - If no dynamic data are required, indicate that.
    - Generate documentation for any required API.


- What, if any, **ACTIONS** is this wireframe responsible for?
    - Button clicks and form submissions often trigger logic that leverages the API layer.
    - If no actions are required, indicate that.
    - Generate documentation for any required API.

```
VERB /route/{path_param}?query_param=param_value

Parameters

TYPE	NAME	        Description
Path	path_param	    Brief description
Query	query_param	    Brief description
Body	body_param	    Brief description

Sample Response:
{
  status:"ok",
  data:{
    key:value
  },
  message:"descriptive message"
}
```

Here is a sample API documentation for getting user information via user id
```
GET /user/{user_id}

Parameters

TYPE	NAME	    DESCRIPTTION
Path	user_id	    Corresponds to _id from MongoDB User collection

Sample Response:
{     
status:"ok",     
  data:{
    user:{
      first_name:"Brutus",
      last_name:"Conway",
      birthday:"1980-04-20T18:25:43.511Z",
      email:"brutus@happy.com",
      password:"Test123!",
      status:"I am loving living life!!!",
      auth_level:"basic"
    }
  },
  message:null
}	
```
---

## CodeBlogg - Login

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## CodeBlogg - Register

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## CodeBlogg - Base Frames and dropdown

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## CodeBlogg - Post Modal

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## Main - User View

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## Main - Bloggs View

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## Main - Network View

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---

## Main Admin view

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---
## CodeBlogg - Admin view

#### What, if any DATA is required from the backend to render the wireframe?

#### What, if any, ACTIONS is this wireframe responsible for?

```

```
---