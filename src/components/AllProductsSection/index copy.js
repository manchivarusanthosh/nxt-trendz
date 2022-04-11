import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
	{
		name: 'Clothing',
		categoryId: '1',
	},
	{
		name: 'electronics',
		categoryId: '2',
	},
	{
		name: 'Appliances',
		categoryId: '3',
	},
	{
		name: 'Grocery',
		categoryId: '4',
	},
	{
		name: 'Toys',
		categoryId: '5',
	},
]

const sortbyOptions = [
	{
		optionId: 'PRICE_HIGH',
		displayText: 'Price (High-Low)',
	},
	{
		optionId: 'PRICE_LOW',
		displayText: 'Price (Low-High)',
	},
]

const ratingsList = [
	{
		ratingId: '4',
		imageUrl:
			'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
	},
	{
		ratingId: '3',
		imageUrl:
			'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
	},
	{
		ratingId: '2',
		imageUrl:
			'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
	},
	{
		ratingId: '1',
		imageUrl:
			'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
	},
]

const apiStatusConstants = {
	initial: 'INITIAL',
	success: 'SUCCESS',
	failure: 'FAILURE',
	inProgress: 'IN_PROGRESS',
}

function AllProductsSection() {
	const [productsList, setProductsList] = useState(null)
	const [categories, setCategories] = useState(null)
	const [searchInput, setsearchInput] = useState('')
	const [activeRatingId, setactiveRatingId] = useState('')
	const [activeCategoryId, setactiveCategoryId] = useState('')
	const [activeOptionId, setactiveOptionId] = useState(
		sortbyOptions[0].optionId
	)
	const [apiStatus, setapiStatus] = useState(apiStatusConstants.initial)

	useEffect(() => {
		getProducts()
	}, [])

	const getProducts = async () => {
		// setapiStatus(apiStatusConstants.inProgress)
		const response = await axios({
			method: 'GET',
			baseURL: 'https://fakestoreapi.com',
			url: '/products',
		})

		if (response.status === 200) {
			const fetchedData = await response.data
			const updatedData = fetchedData.map((product) => ({
				title: product.title,
				// brand: product.brand,
				cat: product.category,
				desc: product.description,
				price: product.price,
				id: product.id,
				imageUrl: product.image,
				rating: product.rating.rate,
			}))
			console.log('api product', fetchedData[0])
			console.log('in product', updatedData[0])

			setProductsList(updatedData)
			setapiStatus(apiStatusConstants.success)
		} else {
			setapiStatus(apiStatusConstants.failure)
		}
	}

	const changeSortby = (activeOptionId) => {
		setactiveOptionId(activeOptionId)
	}

	const clearFilters = () => {
		setsearchInput('')
		setactiveCategoryId('')
		setactiveRatingId('')
	}

	const changeRating = (activeRatingId) => {
		setactiveRatingId(activeRatingId)
	}

	const changeCategory = (activeCategoryId) => {
		setactiveCategoryId(activeCategoryId)
	}

	const enterSearchInput = () => {
		this.getProducts()
	}

	const changeSearchInput = (searchInput) => {
		setsearchInput(searchInput)
	}

	const renderFailureView = () => (
		<div className='products-error-view-container'>
			<img
				src='https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png'
				alt='products failure'
				className='products-failure-img'
			/>
			<h1 className='product-failure-heading-text'>
				Oops! Something Went Wrong
			</h1>
			<p className='products-failure-description'>
				We are having some trouble processing your request. Please try again.
			</p>
		</div>
	)

	const renderProductsListView = () => {
		const shouldShowProductsList = productsList.length > 0

		return shouldShowProductsList ? (
			<div className='all-products-container'>
				<ProductsHeader
					activeOptionId={activeOptionId}
					sortbyOptions={sortbyOptions}
					changeSortby={changeSortby}
				/>
				<ul className='products-list'>
					{productsList.map((product) => (
						<ProductCard productData={product} key={product.id} />
					))}
				</ul>
			</div>
		) : (
			<div className='no-products-view'>
				<img
					src='https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png'
					className='no-products-img'
					alt='no products'
				/>
				<h1 className='no-products-heading'>No Products Found</h1>
				<p className='no-products-description'>
					We could not find any products. Try other filters.
				</p>
			</div>
		)
	}

	const renderLoadingView = () => (
		<div className='products-loader-container'>
			<Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
		</div>
	)

	const renderAllProducts = () => {
		switch (apiStatus) {
			case apiStatusConstants.success:
				return renderProductsListView()
			case apiStatusConstants.failure:
				return renderFailureView()
			case apiStatusConstants.inProgress:
				return renderLoadingView()
			default:
				return null
		}
	}

	return (
		<div className='all-products-section'>
			<FiltersGroup
				searchInput={searchInput}
				categoryOptions={categoryOptions}
				ratingsList={ratingsList}
				changeSearchInput={changeSearchInput}
				enterSearchInput={enterSearchInput}
				activeCategoryId={activeCategoryId}
				activeRatingId={activeRatingId}
				changeCategory={changeCategory}
				changeRating={changeRating}
				clearFilters={clearFilters}
			/>
			{renderAllProducts()}
		</div>
	)
}

export default AllProductsSection
