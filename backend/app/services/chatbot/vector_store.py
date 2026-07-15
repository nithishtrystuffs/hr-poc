import os
import pickle

import faiss
import numpy as np


class VectorStore:

    def __init__(self, dimension: int):
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(dimension)
        self.metadata = []

    def add(self, embeddings, metadata):

        embeddings = np.asarray(embeddings, dtype="float32")

        if len(embeddings) == 0:
            return

        self.index.add(embeddings)
        self.metadata.extend(metadata)

    def search(self, embedding, top_k=5):

        if self.index.ntotal == 0:
            return []

        embedding = np.asarray([embedding], dtype="float32")

        _, indices = self.index.search(embedding, top_k)

        results = []

        for idx in indices[0]:
            if idx == -1:
                continue

            if idx < len(self.metadata):
                results.append(self.metadata[idx])

        return results

    def save(self, directory):

        os.makedirs(directory, exist_ok=True)

        faiss.write_index(
            self.index,
            os.path.join(directory, "policy.index")
        )

        with open(
            os.path.join(directory, "metadata.pkl"),
            "wb"
        ) as f:
            pickle.dump(self.metadata, f)

    def load(self, directory):

        self.index = faiss.read_index(
            os.path.join(directory, "policy.index")
        )

        with open(
            os.path.join(directory, "metadata.pkl"),
            "rb"
        ) as f:
            self.metadata = pickle.load(f)