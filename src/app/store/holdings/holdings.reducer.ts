import { ActionReducer, createReducer, on } from '@ngrx/store';

import { headerActions } from '../../components/header/header.actions';
import { generalActions } from '../../components/main-container/portfolio/general/general.actions';
import { mainContentActions } from '../../components/main-container/portfolio/main-content/main-content.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { LoadingState } from '../models';
import { holdingsEffectsActions } from './holdings.actions';
import { tabData } from './holdings.metadata';
import { HoldingState } from './models';

export const initialState: HoldingState = {
    data: {},
    selectedPortfolio: '',
    filterStocks: [],
    stockProfiles: []
};

export const holdingsReducer: ActionReducer<HoldingState> = createReducer(
    initialState,
    on(headerActions.singOutSuccess, headerActions.singOutFailed, authEffectsActions.userLoggedOut, () => {
        return { ...initialState };
    }),
    on(holdingsEffectsActions.portfolioSelected, (state, action) => {
        return {
            ...state,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            selectedPortfolio: action.portfolio?.id!
        };
    }),
    on(mainContentActions.tabSelected, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    selectedTab: action.data
                }
            }
        };
    }),
    on(
        holdingsEffectsActions.holdingsLoading,
        holdingsEffectsActions.holdingAddedSuccess,
        state => {
            return {
                ...state,
                data: {
                    ...state?.data,
                    [state?.selectedPortfolio]: {
                        ...state?.data[state?.selectedPortfolio],
                        loading: true,
                        loadingState: LoadingState.Loading,
                        tabs: tabData,
                        selectedTab: tabData[0]
                    }
                }
            };
        }),
    on(holdingsEffectsActions.holdingsLoadSuccess, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    data: action.data,
                    loading: false,
                    loadingState: LoadingState.Loaded
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingsLoadFailed, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    error: action.error,
                    loading: false,
                    loadingState: LoadingState.Errored
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingAddedFailed, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    error: action.error
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingsDeleteSuccess, (state, action) => {
        if (state?.data[action.portfolioId]) {
            let newState = { ...state };
            const data = { ...newState?.data };
            delete data[action.portfolioId];
            newState = {
                ...newState,
                data
            };
            return { ...newState };
        }
        return state;
    }),
    on(generalActions.holdingEditSelected, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    selectedHolding: action.data
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingUpdatedSuccess, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    data: state?.data[state?.selectedPortfolio].data.map(item => {
                        if (item.id === action.data.id) {
                            return { ...item, ...action.data };
                        }
                        return item;
                    })
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingDeletedSuccess, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    data: state?.data[state?.selectedPortfolio].data.filter(item => item.id !== action.data.id)
                }
            }
        };
    }),
    on(holdingsEffectsActions.filterStocksSuccess, (state, action) => {
        return {
            ...state,
            filterStocks: action.data
        };
    }),
    on(holdingsEffectsActions.filterStocksFailed, state => {
        return {
            ...state,
            filterStocks: []
        };
    }),
    // Commented for now, cause we don't use this stoci profiles, and is a lot of information
    // on(holdingsEffectsActions.fetchStockProfilesSuccess, (state, action) => {
    //     return {
    //         ...state,
    //         stockProfiles: action.data
    //     };
    // }),
    // on(holdingsEffectsActions.fetchStockProfileSuccess, (state, action) => {
    //     return {
    //         ...state,
    //         stockProfiles: [...state.stockProfiles, action.data]
    //     };
    // })
);
