import { get_structuring_element } from "./structuring_element.js";

const ZERO = 255;
const ONE = 0;

export default function dilation(canvas)
{
    let struct_element = get_structuring_element();

    let data_original = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    let imageData = canvas.getContext("2d").createImageData(data_original);
    let data = imageData.data;
    let row = canvas.width*4;

    let struct_element_size = 3;
    let shift = (struct_element_size-1)/2;

    // fill data with ZERO
    for(let i = 0; i < data.length; i++)
    {
        data[i] = ZERO;
    }

    for(let y = shift; y < canvas.height-shift; y++)
    {
        for(let x = shift*4; x < row-shift*4; x+=4)
        {
            let valR = data_original.data[ (y * row ) + ( x + 0) ];
            let valG = data_original.data[ (y * row ) + ( x + 1) ];
            let valB = data_original.data[ (y * row ) + ( x + 2) ];

            set_in_channel(valR, x, y, 0);
            set_in_channel(valG, x, y, 1);
            set_in_channel(valB, x, y, 2);
        }
    }

    function set_in_channel(val, x, y, channel_number)
    {
        if(val === ONE)
            {
                for(let j = -shift; j <= shift; j++)
                {
                    for(let k = -shift; k <= shift; k++)
                    {           
                        if(struct_element[j+shift][k+shift] === ONE)
                        {
                            data[ ((y+j) * row ) + ( x + (4*k + channel_number)) ] = ONE;
                        }     
                    }
                }
            }
    }

    return imageData;
}