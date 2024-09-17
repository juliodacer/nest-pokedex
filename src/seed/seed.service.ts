import { Injectable } from '@nestjs/common'
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) { }

  // 1 FORMA
  async executeSeed2() {

    await this.pokemonModel.deleteMany({})

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    const insertPromiseArray = []

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2]

      // const pokemon = await this.pokemonModel.create({ name, no })
      insertPromiseArray.push(
        this.pokemonModel.create({ name, no })
      )
    })

    await Promise.all(insertPromiseArray)

    return 'Seed Execute';
  }

  // 2 FORMA: RECOMENDADA
  async executeSeed() {

    await this.pokemonModel.deleteMany({})

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    const pokemonToInsert: { name: string, no: number }[] = []

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2]

      pokemonToInsert.push({ name, no })
    })

    await this.pokemonModel.insertMany(pokemonToInsert)
    // insert into pokemons (name, no)

    return 'Seed Execute';
  }

}
