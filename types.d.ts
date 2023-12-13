export interface project {
	creatorDID: string
	name: string
	image: string
	tagLine: string
	quantity: number
	tiers: tier[]
}

export interface tier {
	// projectId: string
	name: string
	aViewers: string[]
	artWorks: string[]
	projectName: string
	projectImage: string
	projectCreatorUsername: string
}

export interface user {
	username: string
	did: string
	created: project[]
	canView: tier[]
}

export interface submission {
	creatorDID: string
	projectName: string
	projectImg: string
	projectTagLine: string
	quantity: number
	tiers: tier[]
}
