import {Box, Heading, Image} from "@chakra-ui/react";
import {Pokemon} from "../../types/pokemon";
import {useRouter} from "next/router";

interface CardProps {
  pokemon: Pokemon;
  view: string
}

const Card = ({ pokemon, view}: CardProps) => {
  const router = useRouter();
  const urlParts = pokemon.url.split('/');
  const pokemonId = urlParts[urlParts.length - 2];

  const onClickDetail = ():void =>{
    router.push(`/detail/${parseInt(pokemonId, 10)}`);
  }

  const url: string = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parseInt(pokemonId, 10)}.png`

  return (
    <Box
      w={"100%"}
      h="100%"
      bg="white"
      p="1rem"
      display="flex"
      gap="1.2rem"
      borderRadius="10px"
      boxShadow="0 2px 2px 0 rgba(0, 0, 0, 0.08)"
      cursor="pointer"
    >
      <Box display="flex" flexDir="column" gap="1rem" flex="1" onClick={()=>
          onClickDetail()}>
        <Image src={url}
        alt={url}/>
        <Heading as="h2" fontSize="1.2rem">
          {pokemon.name}
        </Heading>
      </Box>
    </Box>
  );
};

export default Card;
