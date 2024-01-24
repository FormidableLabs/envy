import axios from 'axios';
import { NextResponse } from 'next/server';

const SWAPI_URL = 'https://swapi.dev/api/people/1';

export async function GET() {
  // Look - just one call to the SWAPI endpoint!
  const { data } = await axios.get(SWAPI_URL);
  return NextResponse.json(data);
}
