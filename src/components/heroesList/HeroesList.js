import { useHttp } from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createSelector } from '@reduxjs/toolkit';

import { fetchHeroes, deleteUserFromStore, filteredHeroesSelector } from '../../reducers/herous'
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { useCallback } from 'react';

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const filteredHeroes = useSelector(filteredHeroesSelector);

    const { heroesLoadingStatus } = useSelector(state => state.heroes);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes())
        // eslint-disable-next-line
    }, [dispatch]);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(data => console.log(data))
            .then(dispatch(deleteUserFromStore(id)))
            .catch(error => console.log(error))
    }, [])

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <CSSTransition
            timeout={0}
            classNames="hero">
            <h5 className="text-center mt-5">Ошибка загрузки</h5>
        </CSSTransition>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        } else {
            return arr.map(({ id, ...props }) => {
                return <CSSTransition
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)} />
                </CSSTransition>
            })
        }


    }

    return (
        <TransitionGroup component="ul">
            {renderHeroesList(filteredHeroes)}
        </TransitionGroup>
    )
}

export default HeroesList;
