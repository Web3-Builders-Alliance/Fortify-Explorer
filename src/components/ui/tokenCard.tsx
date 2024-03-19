import React, { useState } from 'react';


interface TokenData {
    id: string;
    content: {
        $schema: string;
        json_uri: string;
        files: {
            uri: string;
            cdn_uri: string;
            mime: string;
        }[];
        metadata: {
            description: string;
            name: string;
            symbol: string;
            token_standard: string;
        };
        links: {
            image: string;
        };
    };
    authorities: {
        address: string;
        scopes: string[];
    }[];
    compression: {
        eligible: boolean;
        compressed: boolean;
        data_hash: string;
        creator_hash: string;
        asset_hash: string;
        tree: string;
        seq: number;
        leaf_id: number;
    };
    grouping: any[]; // You can replace any[] with the actual type if needed
    royalty: {
        royalty_model: string;
        target: any; // Replace any with the actual type
        percent: number;
        basis_points: number;
        primary_sale_happened: boolean;
        locked: boolean;
    };
    creators: any[]; // Replace any[] with the actual type if needed
    ownership: {
        frozen: boolean;
        delegated: boolean;
        delegate: any; // Replace any with the actual type
        ownership_model: string;
        owner: string;
    };
    supply: null;
    mutable: boolean;
    burnt: boolean;
    token_info: {
        symbol: string;
        supply: number;
        decimals: number;
        token_program: string;
        price_info: {
            price_per_token: number;
            currency: string;
        };
    };
}

interface TokenCardProps {
    data: TokenData;
}

const TokenCard: React.FC<TokenCardProps> = ({ data }) => {
    const {
        id,
        content,
        authorities,
        compression,
        token_info,
        ownership,
        mutable,
        burnt,
        supply,
        royalty,
        creators,
        grouping
    } = data;
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const renderDescription = () => {
        const truncatedDescription = content?.metadata.description.substring(0, 56);
        const displayDescription = showFullDescription
            ? content?.metadata.description
            : truncatedDescription + '...';

        return (
            <>
                <p className="font-semibold">Description:</p>
                <p className="">{displayDescription}</p>
                {content?.metadata.description.length > 56 && (
                    <button
                        className="text-left text-blue-500 font-bold focus:outline-none mb-2"
                        onClick={toggleDescription}
                    >
                        {showFullDescription ? 'Less' : 'More'}
                    </button>
                )}
            </>
        );
    };

    return (
        <>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center my-12">
            <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
                <p className="text-xl font-semibold mb-4">Token Information</p>

                <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl md:flex h-50">
                    <div className="md:w-1/4 h-full flex items-center">
                        <img
                            src={content?.files[0]?.uri || ''}
                            alt="card-image"
                            className="object-cover w-20 h-20 rounded-full"
                        />
                    </div>
                    <div className="md:w-3/4 p-4 flex flex-col text-left">
                        <p className="font-bold">Name:</p>
                        <p className="mb-2">{content?.metadata?.name}</p>

                        <p className="font-bold">Ticker:</p>
                        <p className="mb-2">{content?.metadata?.symbol}</p>

                        {renderDescription()}

                        <p className="font-semibold">Contract Address:</p>
                        <p className="mb-2">{id}                                                                                                                                                   </p>
                    </div>
                </div>


                <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                            Token Price
                        </p>
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                            ${token_info?.price_info?.price_per_token}
                        </p>
                    </div>
                </div>

                <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                            24h Volume
                        </p>
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                            $95.00
                        </p>
                    </div>

                </div>

                <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                            Total Supply
                        </p>
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                            $95.00
                        </p>
                    </div>

                </div>

                <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                            Holders
                        </p>
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                            $95.00
                        </p>
                    </div>

                </div>



            </div>
        </div>

       
        </>
    );

};

export default TokenCard;