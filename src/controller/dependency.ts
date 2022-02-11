import { common, CommonInterface } from 'usecase/common'

export interface Dependency {
    common: CommonInterface
}

export const dependency: Dependency = {
    common
}
