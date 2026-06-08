export function doc(collection: string, id: string | null) {
  return { collection, id };
}

export function collectionRef(collection: string) {
  return { collection };
}

export async function setDoc(docRef: { collection: string; id: string | null }, data: any) {
  if (!docRef || !docRef.collection || !docRef.id) throw new Error('Invalid docRef');
  const res = await fetch(`/api/db/${docRef.collection}/${docRef.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
