import {Badge, Box, Button, Card, CardBody, Divider, Heading, Image, Progress, Text} from "@chakra-ui/react";
import {useAppDispatch} from "../../../store/store";
import {PokemonData} from "../../../types/book";
import {pokemonApiDetail} from "../../../services/BookApi";
import {useRouter} from "next/router";
import {addFavorite} from "../../../store/Favorites.store";
import * as React from "react";

const PageDetail = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const id = router?.query?.id;
    const circleCommonClasses = 'h-2.5 w-2.5 bg-current rounded-full';


    const { data: pokemonDetail, refetch, isLoading, isFetching, error, status }  = pokemonApiDetail({id});
    function getRandomElementFromArray<T>(arr: T[]): T | undefined {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    const colors: string[] = ['pink', 'teal', 'purple', 'cyan', 'blue', 'green', 'yellow', 'orange', 'red'];
    const randomColor: string | undefined = getRandomElementFromArray(colors);


    const parsedId = parseInt(String(id), 10);
    const url: string = isNaN(parsedId)
        ? ''
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parsedId}.png`;

    return (
        <>
            <div className="grid place-items-center h-screen">
                {
                    isFetching || isLoading ?
                        (
                            <div className='flex items-center  justify-center'>
                                <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
                                <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
                                <div className={`${circleCommonClasses} animate-bounce400`}></div>
                            </div>
                        ) :
                        (
                            <Card maxW='md'>
                                <CardBody>
                                    <Box display="flex" justifyContent="center">
                                        <Image
                                            height="420"
                                            width="280"
                                            src={url}
                                            alt={url}
                                        />
                                    </Box>
                                    <Box
                                        display="grid"
                                        gap="1rem"
                                        css={{
                                            p: {
                                                fontWeight: "bold",
                                                color: "#999999",
                                            },
                                            h3: {
                                                fontWeight: "bold",
                                            },
                                        }}
                                    >
                                        <Heading textAlign="center">{pokemonDetail?.data?.name}</Heading>
                                        <div className="grid grid-cols-2 grid-rows-1 gap-4">
                                            <div >
                                                <Box>
                                                    <Text as="h3">Name:</Text>
                                                    <Text as="p">{pokemonDetail?.data?.name}</Text>
                                                </Box>
                                            </div>
                                            <div >
                                                <Box>
                                                    <Text as="h3">Weight:</Text>
                                                    <Text as="p">{pokemonDetail?.data?.weight}</Text>
                                                </Box>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 grid-rows-1 gap-4">
                                            <div >
                                                <Box>
                                                    <Text as="h3">base experience: </Text>
                                                    <Text as="p">{pokemonDetail?.data?.base_experience}</Text>
                                                </Box>
                                            </div>
                                            <div >
                                                <Box>
                                                    <Text as="h3">base experience: </Text>
                                                    <Text as="p">{pokemonDetail?.data?.base_experience}</Text>
                                                </Box>
                                            </div>
                                        </div>
                                        <Box>
                                            <Text as="h3">Stats: </Text>
                                            {
                                                pokemonDetail?.data?.stats.map((poke, y)=>{
                                                    return(
                                                        <>
                                                            <Text as="span">{poke?.stat?.name}</Text>
                                                            <Progress colorScheme={getRandomElementFromArray(colors)}
                                                                      hasStripe value={poke?.base_stat} />
                                                        </>
                                                    )
                                                })
                                            }
                                        </Box>
                                        <Box>
                                            <Text as="h3">Type: </Text>
                                            {
                                                pokemonDetail?.data?.types.map((poke, y)=> <Badge key={y} variant='subtle' colorScheme={getRandomElementFromArray(colors)}>
                                                    {poke.type.name}
                                                </Badge>)
                                            }
                                        </Box>
                                    </Box>
                                    <Button
                                        position="absolute"
                                        top="7%"
                                        right="20%"
                                        p="8px"
                                        _hover={{
                                            background: "none",
                                        }}
                                        borderRadius="40%"
                                        onClick={() => dispatch(addFavorite(pokemonDetail.data as PokemonData))}
                                    >
                                        <Image
                                            width="25"
                                            height="25"
                                            src="/svg/heart-full.svg"
                                            alt="favorito"
                                        />
                                    </Button>
                                </CardBody>
                                <Divider />
                            </Card>
                        )
                }
            </div>
        </>
    );
};

export default PageDetail;
