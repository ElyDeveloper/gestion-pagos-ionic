import { Getter, inject, Provider } from "@loopback/core";
import { SecurityBindings, UserProfile } from "@loopback/security";


export class CurrentUserProvider implements Provider<UserProfile>{
    constructor(
        @inject.getter(SecurityBindings.USER)
        private getCurrentUser: Getter<UserProfile>,
    ) { }
    
    value(): Promise<UserProfile> {
        return this.getCurrentUser();
    }
}