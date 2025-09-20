This Swift package contains the generated Swift code for the connector `example`.

You can use this package by adding it as a local Swift package dependency in your project.

# Accessing the connector

Add the necessary imports

```
import FirebaseDataConnect
import DataConnectGenerated

```

The connector can be accessed using the following code:

```
let connector = DataConnect.exampleConnector

```


## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code, which can be called from the `init` function of your SwiftUI app

```
connector.useEmulator()
```

# Queries

## GetLessonQuery


### Using the Query Reference
```
struct MyView: View {
   var getLessonQueryRef = DataConnect.exampleConnector.getLessonQuery.ref(...)

  var body: some View {
    VStack {
      if let data = getLessonQueryRef.data {
        // use data in View
      }
      else {
        Text("Loading...")
      }
    }
    .task {
        do {
          let _ = try await getLessonQueryRef.execute()
        } catch {
        }
      }
  }
}
```

### One-shot execute
```
DataConnect.exampleConnector.getLessonQuery.execute(...)
```


## ListLearningModulesQuery


### Using the Query Reference
```
struct MyView: View {
   var listLearningModulesQueryRef = DataConnect.exampleConnector.listLearningModulesQuery.ref(...)

  var body: some View {
    VStack {
      if let data = listLearningModulesQueryRef.data {
        // use data in View
      }
      else {
        Text("Loading...")
      }
    }
    .task {
        do {
          let _ = try await listLearningModulesQueryRef.execute()
        } catch {
        }
      }
  }
}
```

### One-shot execute
```
DataConnect.exampleConnector.listLearningModulesQuery.execute(...)
```


# Mutations
## CreateNewUserMutation
### One-shot execute
```
DataConnect.exampleConnector.createNewUserMutation.execute(...)
```

## UpdateLessonDescriptionMutation
### One-shot execute
```
DataConnect.exampleConnector.updateLessonDescriptionMutation.execute(...)
```

