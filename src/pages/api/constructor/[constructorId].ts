import { NextApiResponse } from "next";

import { NextApiRequest } from "next";

type DriverInfo = {
    Constructors: Array<{
        constructorId: string
        name: string
        nationality: string
    }>
}

type MRData = {
    ConstructorTable: DriverInfo
}

type Results = {
    MRData: MRData
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let constructorData: Results | null = null

    try {
        const constructorId = req.query.constructorId

        const constructor = await fetch(`https://ergast.com/api/f1/constructors/${constructorId}.json`)
  
        if (!constructor.ok) {
            throw new Error(`Failed to fetch constructor: ${constructor.status}`)
        }
        constructorData = await constructor.json()

        res.status(200).json(
            {
                driver: {
                    name: '',
                    lastName: '',
                    nationality: '',
                },
                constructor: {
                    id: constructorData?.MRData.ConstructorTable.Constructors[0].constructorId,
                    name: constructorData?.MRData.ConstructorTable.Constructors[0].name,
                    nationality: constructorData?.MRData.ConstructorTable.Constructors[0].nationality
                } 
            }
        )
    }
    catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' })
    }
}
