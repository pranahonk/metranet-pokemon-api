import {Box, Heading, useToast} from "@chakra-ui/react";
import type {NextPage} from "next";
import {useAppDispatch} from "../store/store";
import Card from "../Components/Card";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {pokemonApi} from "../services/BookApi";
import {setPokemonList} from "../store/Pokemon.store";
import useInfiniteScroll from "react-infinite-scroll-hook";


interface ErrorType {
    error: string;
}

interface ItemData {
    name: string;
    url: string;
}


const Home: NextPage = () => {
    const toast = useToast();
    const dispatch = useAppDispatch();
    const circleCommonClasses = 'h-2.5 w-2.5 bg-current rounded-full';
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<ItemData[]>([]);
    const [urlNext, setUrlNext] =useState("")
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);
    const [error, setError] = useState<Error>();
    const containerRef = useRef(null);


    const { data: pokemonList, refetch, isLoading, isFetching, error: errorPokemon, status }  =
        pokemonApi({ offset, limit });


    async function onclickNext() {
        setLoading(true);
        try {
            if (urlNext) {
                const queryString = urlNext.split('?')[1];
                const urlSearchParams = new URLSearchParams(queryString);
                const offsetParam = urlSearchParams.get("offset");
                const limitParam = urlSearchParams.get("limit");

                await setOffset(Number(offsetParam));
                await setLimit(Number(limitParam));
                await refetch();
                setItems((current) => {
                    const newItems = pokemonList?.data?.results || [];
                    // Filter out items that are already in the current array
                    const filteredItems = newItems.filter((newItem) => {
                        return !current.some((currentItem) => currentItem.name === newItem.name);
                    });
                    return [...current, ...filteredItems];
                });
                setHasNextPage(!!urlNext);
            }

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }


    const [infiniteRef, { rootRef }] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage,
        onLoadMore: onclickNext,
        disabled: !!error,
        rootMargin: '0px 400px 0px 0px',
    });

    useEffect(() => {
        if(pokemonList?.data){
            dispatch(setPokemonList(pokemonList.data));
            setItems((current) => {
                const newItems = pokemonList?.data?.results || [];
                // Filter out items that are already in the current array
                const filteredItems = newItems.filter((newItem) => {
                    return !current.some((currentItem) => currentItem.name === newItem.name);
                });
                return [...current, ...filteredItems];
            });
            setUrlNext(pokemonList?.data?.next);
        }

    }, [pokemonList]);


    return (
        <div ref={rootRef} className="max-h-full max-w-full overflow-auto bg-neutral-50">
            <Box p={{ base: "2rem 0.5rem", md: "1rem 2rem" }} flex="1 0  auto" >

                <Heading textAlign="center" m="2rem 0">
                    List of pokemon
                </Heading>
                {
                    errorPokemon && (
                        toast({
                            title: String((errorPokemon as ErrorType).error),
                            position: 'top',
                            isClosable: true,
                            status: 'error',
                            duration: 2000,
                        })
                    )
                }
                <Box
                    margin="0 auto"
                    display="flex"
                    gap="2rem"
                    flexWrap="wrap"
                    justifyContent="center"
                    paddingTop="2rem"
                    className="container"

                >
                    <div  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {items.map((pokemon, y) => {
                                return (
                                    <>
                                        <Card key={`${pokemon.name}-${y}`} pokemon={pokemon} view={'grid'} />

                                    </>
                                )
                            }
                        )}
                        {hasNextPage && (
                            <div ref={infiniteRef} className='flex items-center  justify-center'>
                                <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
                                <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
                                <div className={`${circleCommonClasses} animate-bounce400`}></div>
                            </div>
                        )}
                    </div>
                </Box>
            </Box>
        </div>
  );
};

export default Home;
