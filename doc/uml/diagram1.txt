@startuml
actor User as Guest
    actor "RegisteredUser" as RegisteredUser
    
    
    
    Guest <|-- RegisteredUser

    usecase "Register" as SE_1
    usecase "View schedule" as SE_2

    usecase "Login" as SE_3
    usecase "Create events" as SE_4
   
    
    
    Guest -u-> SE_1
    Guest -u-> SE_2

    RegisteredUser -u-> SE_2
    RegisteredUser -u-> SE_3
    RegisteredUser -u-> SE_4
@enduml
