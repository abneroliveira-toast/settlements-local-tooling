
# Using the utility [jq](https://jqlang.github.io/jq/)

```brew install jq```


### Sum the settledAmount query result

Assuning we have this json file `output/settled-amount-2023-06-15_1686812789.json` with the following content: 

```json
[
  {
    "shard": "0",
    "amountSettled": "48937636.76"
  },
  {
    "shard": "1",
    "amountSettled": "50347048.66"
  },
  {
    "shard": "2",
    "amountSettled": "56709449.40"
  }
]
```

Executing the following command we can get the sum of the settledAmount

```bash
cat output/amount-settled-2023-06-15_1686812789.json | jq '[.[].settledAmount | tonumber] | add'
```

Will output the result: `155994134.82`