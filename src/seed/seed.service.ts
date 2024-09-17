import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  // 1 FORMA
  async executeSeed2() {

    await this.pokemonModel.deleteMany({})

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

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

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    const pokemonToInsert: { name: string, no: number }[] = []

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2]

      pokemonToInsert.push({ name, no })
    })

    await this.pokemonModel.insertMany(pokemonToInsert)
    // inser to into pokemons (name, no)

    return 'Seed Execute';
  }

}
