# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetLesson*](#getlesson)
  - [*ListLearningModules*](#listlearningmodules)
- [**Mutations**](#mutations)
  - [*CreateNewUser*](#createnewuser)
  - [*UpdateLessonDescription*](#updatelessondescription)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetLesson
You can execute the `GetLesson` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getLesson(): QueryPromise<GetLessonData, undefined>;

interface GetLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetLessonData, undefined>;
}
export const getLessonRef: GetLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLesson(dc: DataConnect): QueryPromise<GetLessonData, undefined>;

interface GetLessonRef {
  ...
  (dc: DataConnect): QueryRef<GetLessonData, undefined>;
}
export const getLessonRef: GetLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonRef:
```typescript
const name = getLessonRef.operationName;
console.log(name);
```

### Variables
The `GetLesson` query has no variables.
### Return Type
Recall that executing the `GetLesson` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonData {
  lesson?: {
    title: string;
    description: string;
  };
}
```
### Using `GetLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLesson } from '@dataconnect/generated';


// Call the `getLesson()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLesson();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLesson(dataConnect);

console.log(data.lesson);

// Or, you can use the `Promise` API.
getLesson().then((response) => {
  const data = response.data;
  console.log(data.lesson);
});
```

### Using `GetLesson`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonRef } from '@dataconnect/generated';


// Call the `getLessonRef()` function to get a reference to the query.
const ref = getLessonRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.lesson);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson);
});
```

## ListLearningModules
You can execute the `ListLearningModules` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listLearningModules(): QueryPromise<ListLearningModulesData, undefined>;

interface ListLearningModulesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListLearningModulesData, undefined>;
}
export const listLearningModulesRef: ListLearningModulesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listLearningModules(dc: DataConnect): QueryPromise<ListLearningModulesData, undefined>;

interface ListLearningModulesRef {
  ...
  (dc: DataConnect): QueryRef<ListLearningModulesData, undefined>;
}
export const listLearningModulesRef: ListLearningModulesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listLearningModulesRef:
```typescript
const name = listLearningModulesRef.operationName;
console.log(name);
```

### Variables
The `ListLearningModules` query has no variables.
### Return Type
Recall that executing the `ListLearningModules` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListLearningModulesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListLearningModulesData {
  learningModules: ({
    id: UUIDString;
    name: string;
  } & LearningModule_Key)[];
}
```
### Using `ListLearningModules`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listLearningModules } from '@dataconnect/generated';


// Call the `listLearningModules()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listLearningModules();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listLearningModules(dataConnect);

console.log(data.learningModules);

// Or, you can use the `Promise` API.
listLearningModules().then((response) => {
  const data = response.data;
  console.log(data.learningModules);
});
```

### Using `ListLearningModules`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listLearningModulesRef } from '@dataconnect/generated';


// Call the `listLearningModulesRef()` function to get a reference to the query.
const ref = listLearningModulesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listLearningModulesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.learningModules);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.learningModules);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewUser
You can execute the `CreateNewUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewUser(): MutationPromise<CreateNewUserData, undefined>;

interface CreateNewUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateNewUserData, undefined>;
}
export const createNewUserRef: CreateNewUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewUser(dc: DataConnect): MutationPromise<CreateNewUserData, undefined>;

interface CreateNewUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateNewUserData, undefined>;
}
export const createNewUserRef: CreateNewUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewUserRef:
```typescript
const name = createNewUserRef.operationName;
console.log(name);
```

### Variables
The `CreateNewUser` mutation has no variables.
### Return Type
Recall that executing the `CreateNewUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewUserData {
  user_insert: User_Key;
}
```
### Using `CreateNewUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewUser } from '@dataconnect/generated';


// Call the `createNewUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createNewUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateNewUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewUserRef } from '@dataconnect/generated';


// Call the `createNewUserRef()` function to get a reference to the mutation.
const ref = createNewUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateLessonDescription
You can execute the `UpdateLessonDescription` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateLessonDescription(): MutationPromise<UpdateLessonDescriptionData, undefined>;

interface UpdateLessonDescriptionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateLessonDescriptionData, undefined>;
}
export const updateLessonDescriptionRef: UpdateLessonDescriptionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLessonDescription(dc: DataConnect): MutationPromise<UpdateLessonDescriptionData, undefined>;

interface UpdateLessonDescriptionRef {
  ...
  (dc: DataConnect): MutationRef<UpdateLessonDescriptionData, undefined>;
}
export const updateLessonDescriptionRef: UpdateLessonDescriptionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLessonDescriptionRef:
```typescript
const name = updateLessonDescriptionRef.operationName;
console.log(name);
```

### Variables
The `UpdateLessonDescription` mutation has no variables.
### Return Type
Recall that executing the `UpdateLessonDescription` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLessonDescriptionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLessonDescriptionData {
  lesson_update?: Lesson_Key | null;
}
```
### Using `UpdateLessonDescription`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLessonDescription } from '@dataconnect/generated';


// Call the `updateLessonDescription()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLessonDescription();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLessonDescription(dataConnect);

console.log(data.lesson_update);

// Or, you can use the `Promise` API.
updateLessonDescription().then((response) => {
  const data = response.data;
  console.log(data.lesson_update);
});
```

### Using `UpdateLessonDescription`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLessonDescriptionRef } from '@dataconnect/generated';


// Call the `updateLessonDescriptionRef()` function to get a reference to the mutation.
const ref = updateLessonDescriptionRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLessonDescriptionRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lesson_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson_update);
});
```

