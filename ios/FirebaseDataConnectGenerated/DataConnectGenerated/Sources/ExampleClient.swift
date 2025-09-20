
import Foundation

import FirebaseCore
import FirebaseDataConnect








public extension DataConnect {

  static let exampleConnector: ExampleConnector = {
    let dc = DataConnect.dataConnect(connectorConfig: ExampleConnector.connectorConfig, callerSDKType: .generated)
    return ExampleConnector(dataConnect: dc)
  }()

}

public class ExampleConnector {

  let dataConnect: DataConnect

  public static let connectorConfig = ConnectorConfig(serviceId: "wordplay", location: "us-central1", connector: "example")

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect

    // init operations 
    self.createNewUserMutation = CreateNewUserMutation(dataConnect: dataConnect)
    self.getLessonQuery = GetLessonQuery(dataConnect: dataConnect)
    self.updateLessonDescriptionMutation = UpdateLessonDescriptionMutation(dataConnect: dataConnect)
    self.listLearningModulesQuery = ListLearningModulesQuery(dataConnect: dataConnect)
    
  }

  public func useEmulator(host: String = DataConnect.EmulatorDefaults.host, port: Int = DataConnect.EmulatorDefaults.port) {
    self.dataConnect.useEmulator(host: host, port: port)
  }

  // MARK: Operations
public let createNewUserMutation: CreateNewUserMutation
public let getLessonQuery: GetLessonQuery
public let updateLessonDescriptionMutation: UpdateLessonDescriptionMutation
public let listLearningModulesQuery: ListLearningModulesQuery


}
